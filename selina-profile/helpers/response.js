const response_data = (data=null, status_code=1, message="") => {
    return {
        data,
        status_code,
        message
    }
}

module.exports = response_data