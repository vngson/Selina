const response_data = require('../helpers/response')
const { validationResult } = require('express-validator')

const validate_request_middleware = async (req, res, next) => {
    try {
        const input_validate = validationResult(req)
        
        if (!input_validate.isEmpty()) {
            return res.json(response_data(
                data=input_validate.array(),
                status_code=4,
                message='',
                role=req?.user_role
            ))
        }
        next()
    }
    catch (err) {
        return res.json(response_data(
            data=err.message,
            status_code=4,
            message="Lỗi hệ thống!",
            role=req?.user_role
        ))
    }
}

module.exports = {
    validate_request_middleware
}