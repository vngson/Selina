const { check } = require('express-validator');

const create_account_validator = () => {
    return [
        check("email").isEmail(),
        check("full_name").isString().isLength({ max: 50, min: 1 }),
        check("password").isString(),
        // check("device_token").isString(),
        check("user_type").isString(),
        // check("phone_num").isMobilePhone(),
        check("gender").isBoolean()
    ]
}

const approve_account_validator = () => {
    return [
        // check("phone_num").isMobilePhone(),
        check("email").isEmail(),
        check("otp").isString().isLength({ max: 8, min: 8}),
    ]
}

module.exports = { 
    create_account_validator,
    approve_account_validator
}