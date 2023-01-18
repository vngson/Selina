const { check } = require('express-validator');

const modify_product_info_validate = () => {
    return [
        check("name").isString().isLength({ max: 50, min: 1 }),
        check("desc").isString().isLength({ max: 1000, min: 0 }),
        check("author").isString().isLength({ max: 200, min: 0 }),
        check("quantity").isInt(),
        check("price").isInt()
    ]
}

module.exports = {
    modify_product_info_validate
}