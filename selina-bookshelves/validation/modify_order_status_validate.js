const { check } = require('express-validator')

const modify_order_status_validator = () => {
	return [
		check("order_id").trim().escape().isInt({ min: 1 }),
		check("order_status").isString().isIn(["rejected", , "delivering", "waiting", "delivered", "cancelled"])
	]
}

module.exports = {
	modify_order_status_validator
}