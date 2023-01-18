const { validationResult } = require('express-validator')
const response_data = require('../helpers/response')
const Permission = require('../models/Permission')

const add_new_permission = async (req, res, next) => {
    try {
        const input_validate = validationResult(req)
        if (!input_validate.isEmpty()) {
            return res.json(response_data(input_validate.array(), status_code=4))
        }

        const body = req.body
        const permission_code = body?.permission_code
        const permission_name = body?.permission_name
        const permission_desc = body?.permission_desc

        const new_per = new Permission({
            permission_code,
            permission_name,
            permission_desc
        })

        const validate = new_per.validateSync()

        if (!!validate) {
            return res.json(response_data(data="invalid_input", status_code=4, message=validate))
        }
        
        const res_save = Boolean(await new_per.save())

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

module.exports = {
    add_new_permission
}   