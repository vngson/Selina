const { check } = require('express-validator')

const add_user_permission_validator = () => {
    return [
        check("user_id").isInt(),
        check("permission_code").isString()
    ]
}

const add_user_permissions_validator = () => {
    return [
        check("user_id").isInt(),
        check("permission_codes").isArray()
    ]
}

const get_user_permissions_validator = () => {
    return [
        check("user_id").isInt()
    ]
}

module.exports = {
    add_user_permission_validator,
    get_user_permissions_validator,
    add_user_permissions_validator
}