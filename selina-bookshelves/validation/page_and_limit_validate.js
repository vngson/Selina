const { query } = require('express-validator')

const page_and_limit_validator = () => {
    return [
        query('page').optional().trim().isInt({ min: 1 }),
        query('limit').optional().trim().isInt({ min: 1 })
    ]
}

module.exports = {
    page_and_limit_validator
}