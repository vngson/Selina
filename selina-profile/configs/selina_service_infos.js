const SELINA_SERVICE_INFOS = {
    auth: {
        staging: {
            domain: "https://selina-auth-staging.herokuapp.com/selina-auth-api"
        },
        production: {
            domain: "https://selina-auth.onrender.com/selina-auth-api"
        },
        local: {
            domain: "http://127.0.0.1:8800/selina-auth-api"
        }
    }
}

module.exports = SELINA_SERVICE_INFOS