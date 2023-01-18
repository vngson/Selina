const { check } = require('express-validator')

const add_new_permission_validator = () => {
    return [
        check("code").isString().isLength({ max: 50, min: 1 }),
        check("name").isString().isLength({ max: 200, min: 1 }),
        check("desc").isString().isLength({ max: 200, min: 0 }),
    ]
}

module.exports = {
    add_new_permission_validator
}