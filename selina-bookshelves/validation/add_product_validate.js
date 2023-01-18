const { check } = require('express-validator');

const add_new_product_validator = () => {
    return [
        check("name").isString().isLength({ max: 50, min: 1 }),
        check("desc").isString().isLength({ max: 2000, min: 0 }),
        check("author").isString().isLength({ max: 200, min: 0 }),
        check("quantity").isInt(),
        check("price").isInt()
    ]
}

module.exports = {
    add_new_product_validator
}