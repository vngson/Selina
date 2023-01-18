const { check } = require('express-validator');

const personal_info_modification_form_validator = () => {
	return [
		check("full_name").optional().isString().trim().escape().isLength({ max: 50, min: 1 }),
        check("phone_num").optional().isMobilePhone().trim().escape().isLength({ max: 10, min: 1 }),
        check("address").optional().isString().trim().escape(),
        check("gender").optional().isBoolean()
	]
}

const user_id_input_validator = () => {
	return [
		check("user_id").trim().isInt({ min: 1 })
	]
}

module.exports = {
	personal_info_modification_form_validator,
	user_id_input_validator
}