const { query } = require('express-validator')

const product_id_validator = () => {
    return [
        query('id').trim().isInt({ min: 1 })
    ]
}

module.exports = {
    product_id_validator
}