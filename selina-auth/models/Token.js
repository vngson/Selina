const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const Token = new mongoose.Schema(
    {
        id: { type: Number },
        user_id: { type: Number, required: true },
        token: { type: String, required: true },
        token_type: { type: String, required: false, default: "access_token"},
    }, 
    { 
        // _id: false,
        timestamps: true 
    }
)

Token.plugin(AutoIncrement, { inc_field: "id" })

module.exports = mongoose.model("token", Token)