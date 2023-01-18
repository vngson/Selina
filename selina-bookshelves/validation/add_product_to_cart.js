const { check } = require('express-validator');

const add_product_to_cart_validator = () => {
    return [
        check("book_id").isInt(),
        check("quantity").isInt()
    ]
}

module.exports = {
    add_product_to_cart_validator
}