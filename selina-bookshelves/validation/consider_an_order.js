const { check } = require('express-validator');

const consider_an_order_validator = () => {
    return [
        check("order_id").isInt(),
        check("result").isBoolean()
    ]
}

module.exports = {
    consider_an_order_validator
}