const { check } = require('express-validator')

const take_an_order_validate = () => {
    return [
        check("book_group_id").isNumeric().isInt(),
        check("address").isString().isLength({ min: 0 }),
        check("phone_num").isString().isLength({ min: 0 })
    ]
}

module.exports = {
    take_an_order_validate
}