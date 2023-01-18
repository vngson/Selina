const response_data = require("../helpers/response")
const {
    get_unaccented_text_vn,
    get_accent_insensitive_regex_vn
} = require("../helpers/vn_text")

const process_search_term_middleware = async (req, res, next) => {
    try {
        const search_term = req?.query?.searchterm
        const keyword = get_unaccented_text_vn(search_term)

        req.temp_database_query = {
            name: {
                $regex: get_accent_insensitive_regex_vn(keyword),
                $options: 'i'
            }
        }
        next()
    }
    catch(err) {
        return res.json(response_data(
            data=err.message,
            status_code=4,
            message="Lỗi hệ thống!",
            role=req?.user_role
        ))
    }
}

module.exports = {
    process_search_term_middleware
}