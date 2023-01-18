const { query } = require('express-validator')

const search_term_validator = () => {
    return [
        query('searchterm')
            .isString()
            .trim()
            .isLength({ max: 50, min: 1 })
    ]
}

module.exports = {
    search_term_validator
}