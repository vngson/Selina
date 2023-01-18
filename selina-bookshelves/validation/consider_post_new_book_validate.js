const { query, check } = require('express-validator')

const consider_post_new_book_validator = () => {
	return [
		query("book_id").trim().escape().isInt({ min: 1 }),
		check("approved").isBoolean()
	]
}

module.exports = {
	consider_post_new_book_validator
}