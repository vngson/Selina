const get_session_data = require('../helpers/get_session_data')
const response_data = require('../helpers/response')

const get_user_role_middleware = async (req, res, next) => {
    try {
        const session_data = JSON.parse(await get_session_data(req))
        req.user_role = session_data?.user_type || "normal_user"
        next()
    }
    catch (err) {
        return res.json(response_data(
            data=err.message,
            status_code=4,
            message="Lỗi hệ thống!"
        ))
    }
}

module.exports = {
    get_user_role_middleware
}