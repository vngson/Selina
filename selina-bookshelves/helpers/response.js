const response_data = (data=null, status_code=1, message="", role="normal_user") => {
    return {
        data,
        status_code,
        message,
        user_role: role
    }
}
// status_codes
// 1: success
// 2: token expired, call api refresh-access-token
// 3: Session expired -> go to Login page
// 4: Internal Server Error

module.exports = response_data