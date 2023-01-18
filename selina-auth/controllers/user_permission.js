const { validationResult } = require('express-validator')
const response_data = require('../helpers/response')
const Permission = require('../models/Permission')
const UserPermission = require('../models/UserPermission')

const add_user_permission = async (req, res) => {
    try {
        const input_validate = validationResult(req)
        if (!input_validate.isEmpty()) {
            return res.json(response_data(input_validate.array(), status_code=4))
        }

        const body = req.body
        const permission_code = body?.permission_code
        const user_id = body?.user_id

        const permission = await Permission.findOne({permission_code: permission_code})

        if (!permission) {
            return res.json(response_data(data="permission_invalid", status_code=4))
        }
        
        const new_user_permission = UserPermission({user_id, permission_code})

        const validate = new_user_permission.validateSync()

        if (!!validate) {
            return res.json(response_data(data="invalid_input", status_code=4, message=validate))
        }
        
        const res_save = Boolean(await new_user_permission.save())

        if (res_save) {
            return res.json(response_data())
        }
        else {
            return res.json(response_data(data="insert_fail", status_code=4, message=""))
        }
    }
    catch (err) {
        return res.json(response_data(
                data=err.message, 
                status_code=4, 
                message="Lỗi hệ thống!"
            )
        )
    }
}

const add_user_permissions = async (req, res) => {
    try {
        const input_validate = validationResult(req)
        if (!input_validate.isEmpty()) {
            return res.json(response_data(input_validate.array(), status_code=4))
        }

        const body = req.body
        const permission_codes = body?.permission_codes
        const user_id = body?.user_id

        const permissions = await Permission.find(
            {
                permission_code: {
                    $in: permission_codes
                }
            }
        )

        if (!permissions) {
            return res.json(response_data(data="permission_invalid", status_code=4))
        }

        
        
        const new_user_permissions = []

        for (let permission of permissions) {
            new_user_permissions.push({
                user_id,
                permission_code: permission.permission_code
            })
        }

        const insert_res = await UserPermission.insertMany(new_user_permissions)

        if (insert_res) {
            return res.json(response_data())
        }
        else {
            return res.json(response_data(data="insert_fail", status_code=4, message=""))
        }
    }
    catch (err) {
        return res.json(response_data(
                data=err.message, 
                status_code=4, 
                message="Lỗi hệ thống!"
            )
        )
    }
}

const get_user_permissions = async (req, res) => {
    try {
        const input_validate = validationResult(req)
        if (!input_validate.isEmpty()) {
            return res.json(response_data(input_validate.array(), status_code=4))
        }

        const body = req.body
        const user_id = body.user_id

        const permissions = await UserPermission.find({user_id: user_id})
        const list_permission = []
        for (const permission of permissions) {
            list_permission.push(permission.permission_code)
        }

        return res.json(response_data(list_permission))
    }
    catch (err) {
        return res.json(response_data(
                data=err.message, 
                status_code=4, 
                message="Lỗi hệ thống!"
            )
        )
    }
}

module.exports = {
    add_user_permission,
    get_user_permissions,
    add_user_permissions
}