const response_data = require("../helpers/response")
const { redis_base } = require("../helpers/redis_base")

const auth_user_middleware = async (req, res, next) => {
    try {
        const access_token = req.headers.authorization

        if (!access_token) {
            return res.json(response_data(
                    data = "no_access_token",
                    status_code=4
                )
            )
        }
        const user_session_in_redis = await redis_base.get(`access_token_${access_token.replace("Bearer ", "")}`)

        if (!user_session_in_redis) {
            return res.json(response_data(
                    data = "access_token_expired",
                    status_code=2
                )
            )
        }

        const user_session = JSON.parse(user_session_in_redis)

        if (user_session?.account_status === "pending") {
            return res.json(response_data(
                    data = "unverified_account",
                    status_code=4,
                    message="Vui lòng xác minh tài khoản để thực hiện chức năng này!"
                )
            )
        }
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
    auth_user_middleware
}