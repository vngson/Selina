const cryptoJS = require('crypto-js')
const axios = require('axios')
const { validationResult } = require('express-validator');
const UserInformationSchema = require('../models/UserInformation')
const password_encode_key = require('../configs/app_configs')
const response_data = require('../helpers/response')
const generate_otp = require('../helpers/generate_otp')
const { send_mail } = require('../helpers/send_email')
const { redis_base } = require('../helpers/redis_base')
const INIT_ROLE_PERMISSIONS = require('../configs/init_role_permissions')
const SELINA_SERVICE_INFOS = require('../configs/selina_service_infos')
const { APP_ENV } = require('../configs/app_configs')

const generate_otp_and_send_email = async (email) => {
    try {
        const otp = await generate_otp(email, "otp_create_account_")
        send_mail(
            email, 
            "[Selina] - Xác thực tài khoản.", 
            `
                <div>
                    <div style="background-color:#f0f5fa;">
                        <div style="padding-bottom:10px; padding-top:10px; margin: 0 auto; border-radius: 8px;">
                            <div style="width:100%; border-radius: 8px;">
                                <img style="border-radius: 8px; text-align:center; width:125px; margin: 20px auto; display: block;" src="https://firebasestorage.googleapis.com/v0/b/selina-d8690.appspot.com/o/Selina%20small.png?alt=media&token=9aeb31a4-6a94-4743-832f-6c065ca0dbdf">
                            </div>
                        </div>
                        <div style="background-color:#fff; padding-bottom:20px; padding-top:20px">
                            <div style="vertical-align:middle; width:100%;">
                                <div style="text-align:center; font-size:20px; font-family:open Sans Helvetica, Arial, sans-serif; padding-left:25px; padding-right:25px;"><span>Xin chào,</span></div>
                                <br>
                                <div style="text-align:center; font-size:20px; font-family:open Sans Helvetica, Arial, sans-serif; padding-left:25px; padding-right:25px;">Vui lòng sử dụng OTP được cung cấp bên dưới để xác thực tài khoản Selina của bạn:</div>
                                <br>
                                <div style="text-align:center; font-size:30px; font-weight:bold; font-family:open Sans Helvetica, Arial, sans-serif">${otp}</div>
                                <br> 
                                <div style="text-align:center; font-size:20px; font-family:open Sans Helvetica, Arial, sans-serif; padding-left:25px; padding-right:16px">Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email hoặc liên hệ với chúng tôi.</div>
                                <br>
                                <div style="text-align:center; font-size:20px; font-family:open Sans Helvetica, Arial, sans-serif; padding-left:25px; padding-right:25px">Chân thành cảm ơn! <br/><br/><b>Selina team</b></div>
                            </div>
                        </div>
                    </div>
                </div> 
            `
        )
    }
    catch (e) {
        console.log(e)
    }
}

const create_new_account = async (req, res, next) => {
    try {
        input_validate = validationResult(req)
        if (!input_validate.isEmpty()) {
            return res.json(response_data(input_validate.array(), status_code=4))
        }

        data = req.body
        email = data.email

        check_account_exists = await UserInformationSchema.findOne({ email: email})
        
        if (check_account_exists) {
            return res.json(response_data(
                data="account_existed", 
                status_code=4, 
                message="Email đã được sử dụng cho tài khoản khác!")
            )
        }
        new_account_info = {
            full_name: data.full_name,
            phone_num: data.phone_num || "",
            email: data.email,
            password: data.password,
            user_type: data.user_type || "normal_user",
            gender: data.gender,
            // device_token: data.device_token
        }
        new_account = new UserInformationSchema(new_account_info)
        validate = new_account.validateSync()
        if (!!validate) {
            return res.json(response_data(data="invalid_input", status_code=4, message=validate))
        }
        register_res = Boolean(await new_account.save())

        // const user_id = new_account.user_id
        // const permissions = INIT_ROLE_PERMISSIONS[new_account.user_type].permissions

        // if (Boolean(permissions)) {
        //     axios.post(
        //         `${SELINA_SERVICE_INFOS.auth[APP_ENV].domain}/add-user-permissions`,
        //         {
        //             user_id: user_id,
        //             permission_codes: permissions
        //         }
        //     )
        // }


        if (register_res) {
            generate_otp_and_send_email(email)
            return res.json(response_data(data={}, status_code=1, message="Đăng ký tài khoản thành công!"))
        }
        else {
            return res.json(response_data(data={}, status_code=4, message="Đăng ký không thành công!"))
        }

    }
    catch (err) {
        return res.json(response_data(data=err.message, status_code=4, message="Lỗi hệ thống!"))
    }
}

const approve_account = async (req, res, next) => {
    try {
        input_validate = validationResult(req)
        if (!input_validate.isEmpty()) {
            return res.json(response_data(
                input_validate.array(), 
                status_code=4,
                message="OTP phải có 8 ký tự!"
            ))
        }

        const body = req.body
        const email = body.email
        const otp = body.otp

        const otp_in_redis = await redis_base.get("otp_create_account_" + email)
        if (String(otp_in_redis) === String(otp)) {
            await UserInformationSchema.updateOne(
                {
                    email: email
                },
                {
                    "account_status": "normal"
                }
            )
            return res.json(response_data())
        }
        else {
            return res.json(response_data(data={}, status_code=4, message="OTP không chính xác!"))
        }
    }
    catch (err) {
        return res.json(response_data(data=err.message, status_code=4, message="Lỗi hệ thống!"))
    }
}

const re_send_otp = async (req, res, next) => {
    try {
        input_validate = validationResult(req)
        if (!input_validate.isEmpty()) {
            return res.json(response_data(
                input_validate.array(), 
                status_code=4,
                message="Vui lòng kiểm tra lại email của bạn!"
            ))
        }

        const body = req.body
        const email = body.email
        generate_otp_and_send_email(email)
        return res.json(response_data())    
    }
    catch (err) {
        return res.json(response_data(data=err.message, status_code=4, message="Lỗi hệ thống!"))
    }
}

const recover_password = async (req, res, next) => {
    try {
        console.log(res)
        input_validate = validationResult(req)

        if (!input_validate.isEmpty()) {
            return res.json(response_data(
                input_validate.array(), 
                status_code=4,
                message="Vui lòng kiểm tra lại email của bạn!"
            ))
        }
        const characters_numbers_spec_chars = "qwertyuiopasdfghjklzxcvbnm!@#$%^&*()_+0123456789"
        const body = req.body
        const email = body?.email

        
        let new_password = ""
        
        for(let i = 0; i < 12; i++) {
            new_password += characters_numbers_spec_chars[
                Math.floor(Math.random() * characters_numbers_spec_chars.length)
            ]
        }

        const curr_user = await UserInformationSchema.updateOne(
            {
                email: email
            }, 
            {
                password: new_password
            }
        )
        if (!curr_user.matchedCount) {
            return res.json(response_data(
                "email_does_not_match", 
                status_code=4,
                message="Không có tài khoản nào được đăng ký với email này!"
            ))
        }
        send_mail(
            email, 
            "[Selina] Khôi phục mật khẩu.", 
            `
                <div>
                    <div style="background-color:#f0f5fa;">
                        <div style="padding-bottom:10px; padding-top:10px; margin: 0 auto; border-radius: 8px;">
                            <div style="width:100%; border-radius: 8px;">
                                <img style="border-radius: 8px; text-align:center; width:125px; margin: 20px auto; display: block;" src="https://firebasestorage.googleapis.com/v0/b/selina-d8690.appspot.com/o/Selina%20small.png?alt=media&token=9aeb31a4-6a94-4743-832f-6c065ca0dbdf">
                            </div>
                        </div>
                        <div style="background-color:#fff; padding-bottom:20px; padding-top:20px">
                            <div style="vertical-align:middle; width:100%;">
                                <div style="text-align:center; font-size:20px; font-family:open Sans Helvetica, Arial, sans-serif; padding-left:25px; padding-right:25px;"><span>Xin chào,</span></div>
                                <br>
                                <div style="text-align:center; font-size:20px; font-family:open Sans Helvetica, Arial, sans-serif; padding-left:25px; padding-right:25px;">Hệ thống đã khôi phục mật khẩu của bạn, hãy sử dụng mật khẩu dưới đây để đăng nhập Selina:</div>
                                <br>
                                <div style="text-align:center; font-size:30px; font-weight:bold; font-family:open Sans Helvetica, Arial, sans-serif">${new_password}</div>
                                <br> 
                                <div style="text-align:center; font-size:20px; font-family:open Sans Helvetica, Arial, sans-serif; padding-left:25px; padding-right:16px">Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email hoặc liên hệ với chúng tôi.</div>
                                <br>
                                <div style="text-align:center; font-size:20px; font-family:open Sans Helvetica, Arial, sans-serif; padding-left:25px; padding-right:25px">Chân thành cảm ơn! <br/><br/><b>Selina team</b></div>
                            </div>
                        </div>
                    </div>
                </div> 
            `    
        )
        return res.json(response_data())
    }
    catch (err) {
        return res.json(response_data(data=err.message, status_code=4, message="Lỗi hệ thống!"))
    }
}


module.exports = {
    create_new_account,
    approve_account,
    re_send_otp,
    recover_password
}