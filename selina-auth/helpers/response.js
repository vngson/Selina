const response_data = (data=null, status_code=1, message="", role="normal_user") => {
    return {
        data,
        status_code,
        message,
        role
    }
}

module.exports = response_data