const SELINA_API_SERVICE_INFOS = {
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
    },
    profile: {
        staging: {
            domain: "https://selina-profile-staging.herokuapp.com/selina-profile-api"
        },
        production: {
            domain: "https://selina-profile-l839.onrender.com/selina-profile-api"
        },
        local: {
            domain: "http://127.0.0.1:8801/selina-profile-api"
        }
    },
    bookshelves: {
        staging: {
            domain: "https://selina-bookshelves-staging.herokuapp.com/selina-bookshelves-api"
        },
        production: {
            domain: "https://selina-bookshelves.onrender.com/selina-bookshelves-api"
        },
        local: {
            domain: "http://127.0.0.1:8802/selina-bookshelves-api"
        }
    }
}

module.exports = SELINA_API_SERVICE_INFOS