const { validationResult } = require('express-validator')
const { 
    password_encode_key, 
    SECRET_KEY,
    APP_ENV,
    encode_key
} = require('../configs/app_configs')
const response_data = require('../helpers/response')
const { services } = require('../configs/app_configs')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const { redis_base } = require('../helpers/redis_base')
const Token = require('../models/Token')
const UserPermission = require('../models/UserPermission')
const get_session_data = require('../helpers/get_session_data')

const login = async (req, res, next) => {
    try{
        const input_validate = validationResult(req)
        if (!input_validate.isEmpty()) {
            return res.json(response_data(input_validate.array(), status_code=4))
        }

        const body = req.body
        const account = body.email
        const password = body.password

        let user_data = await axios.post(
            `${services.profile[APP_ENV].domain}/get-user-info-by-email`,
            {
                email: account,
                secret_key: SECRET_KEY
            }
        )
        .then(function (response) {
            return response.data
        })
        .catch(function (error) {
            return res.json(response_data(data="call_api_failure", status_code=4, message="Lỗi hệ thống!"))
        })

        if (Number(user_data.status_code) === 1) {
            user_data = user_data.data
            console.log(user_data)
            
            if (user_data === "no_data") {
                return res.json(response_data(data="email_no_exists", status_code=4, message="Tài khoản không tồn tại!"))
            }

            if (user_data.account_status === "pending") {
                return res.json(response_data(data="unverified_account", status_code=4, message="Tài khoản không tồn tại!"))
            }

            if (user_data.account_status === "banned") {
                return res.json(response_data(data="account_banned", status_code=4, message="Tài khoản đã bị khóa!"))
            }

            if (user_data.password === password){
                delete user_data.password

                // console.log(user_data)
                const user_permissions = []
                const user_permissions_obj = await UserPermission.find({email: account})
                user_permissions_obj.forEach(
                    user_permission_obj => user_permissions.push(
                        user_permission_obj.permission_code
                    )
                )
                user_data.permissions = user_permissions
                const token = await generate_token(user_data)

                if (Boolean(token)) {
                    const access_token_in_db = await Token.findOne({
                        "user_id": user_data.user_id,
                        "token_type": "access_token"
                    })

                    const refresh_token_in_db = await Token.findOne({
                        "user_id": user_data.user_id,
                        "token_type": "refresh_token"
                    })
                    

                    if (access_token_in_db) {
                        redis_base.del(`access_token_${access_token_in_db.token}`)
                        const new_access_token = await Token.findOneAndUpdate(
                            {
                                "user_id": user_data.user_id,
                                "token_type": "access_token"
                            },
                            {
                                "token": token.access_token
                            }
                        )
                    }
                    else {
                        const new_access_token = new Token({
                            "user_id": user_data.user_id,
                            "token": token.access_token,
                            "token_type": "access_token"
                        })

                        if (!new_access_token.validateSync()) {
                            new_access_token.save()
                        }
                        else {
                            return res.json(response_data(data="token_object_invalid", status_code=4, message="Lỗi hệ thống!")) 
                        }
                        
                    }

                    if (refresh_token_in_db) {
                        redis_base.del(`refresh_token_${refresh_token_in_db.token}`)
                        const new_refresh_token = await Token.findOneAndUpdate(
                            {
                                "user_id": user_data.user_id,
                                "token_type": "refresh_token"
                            },
                            {
                                "token": token.refresh_token
                            }
                        )
                    }
                    else {
                        const new_refresh_token = new Token({
                            "user_id": user_data.user_id,
                            "token": token.refresh_token,
                            "token_type": "refresh_token"
                        })

                        if (!new_refresh_token.validateSync()) {
                            new_refresh_token.save()
                        }
                        else {
                            return res.json(response_data(data="token_object_invalid", status_code=4, message="Lỗi hệ thống!")) 
                        }
                        
                    }
                    token.user_data = user_data
                    return res.json(response_data(token))
                }
                else {
                    return res.json(response_data(data="system_error", status_code=4, message="Lỗi hệ thống!"))
                }
            }
            else {
                return res.json(response_data(data="password_incorrect", status_code=4, message="Mật khẩu không chính xác!"))
            }
        }
        else {
            return res.json(response_data(data="call_api_failure", status_code=4, message="Lỗi hệ thống!"))
        }
    }
    catch(err) {
        return res.json(response_data(data=err.message, status_code=4, message="Lỗi hệ thống!"))
    }
}

const generate_token = async (user_data) => {
    try {
        const access_token = jwt.sign(
            {
                user_data
            }, 
            "access_token_" + encode_key,
            {
                expiresIn: "3d"
            }
        )
        await redis_base.set(`access_token_${access_token}`, JSON.stringify(user_data), {
            EX: 3*24*60*60,
        })
        const refresh_token = jwt.sign(
            {
                user_data
            }, 
            "refresh_token_" + encode_key,
            {
                expiresIn: "15d"
            }
        )
        await redis_base.set(`refresh_token_${refresh_token}`, JSON.stringify(user_data), {
            EX: 15*24*60*60,
        })
        return {
            access_token,
            refresh_token
        }
    }
    catch (err){
        console.log(err)
        return false
    }
}

const refresh_token = async (req, res, next) => {
    try {
        const body = req.body
        const refresh_token = body.refresh_token

        const user_data_in_redis = await redis_base.get(`refresh_token_${refresh_token}`)
        
        if (!Boolean(user_data_in_redis)) {
            return res.json(response_data(data="token_expired", status_code=3))
        }
        const user_data = JSON.parse(user_data_in_redis)

        const access_token = jwt.sign(
            {
                user_data
            }, 
            "access_token_" + encode_key,
            {
                expiresIn: "3d"
            }
        )
        await redis_base.set(`access_token_${access_token}`, JSON.stringify(user_data), {
            EX: 3*24*60*60,
        })
        return res.json(response_data({access_token}))
    }
    catch (err) {
        console.log(err)
        return res.json(response_data(data=err.message, status_code=4, message="Lỗi hệ thống!"))
    }
}

const ping = async (req, res) => {
    const session = await get_session_data(req)
    const user_role = session?.user_type || "normal_user"
    
    return res.json(response_data(
        data=session,
        status_code=1,
        message="",
        role=user_role
    ))
}

const logout = async (req, res) => {
    try {
        let access_token = req.headers.authorization

        if (access_token) {
            access_token = access_token.replace("Bearer ", "")
            const remove_access_token = await redis_base.del(`access_token_${access_token}`)

            return res.json(response_data(remove_access_token))
        }
        return res.json(response_data("no_access_token", status_code=4, message="Lỗi hệ thống!"))
    }
    catch (err) {
        console.log(err)
        return res.json(response_data(data=err.message, status_code=4, message="Lỗi hệ thống!"))
    }
}

const get_user_tokens = async (req, res, next) => {
    try {
        const body = req.body
        const user_id = Number(body.user_id)

        const tokens = await Token.findOne({
            user_id: user_id,
            token_type: "access_token"
        })

        if (!tokens) {
            return res.json(response_data(
                "user_not_found",
                4,
                "user_not_found"
            ))
        }

        return res.json(response_data(tokens))

    }
    catch (err) {
        console.log(err)
        return res.json(response_data(data=err.message, status_code=4, message="Lỗi hệ thống!"))
    }
}

module.exports = {
    login,
    refresh_token,
    ping,
    logout,
    get_user_tokens
}