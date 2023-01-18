const admin = require('firebase-admin')
const { firebase_config, bucket_endpoint } = require('../configs/firebase_configs')
const service_account = require("../configs/firebase_service_config.json");

admin.initializeApp({
    credential: admin.credential.cert(service_account),
    storageBucket: "gs://selina-d8690.appspot.com"
}) 

const bucket = admin.storage().bucket()

module.exports = {
    bucket
}