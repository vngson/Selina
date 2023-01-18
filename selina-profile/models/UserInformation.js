const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const UserInformation = new mongoose.Schema(
    {
        user_id: { type: Number },
        full_name: { type: String, required: true, max_length: 50 },
        phone_num : { type: String, required: false, length: 10 },
        email: { type: String, required: true, unique: true, max_length: 50 },
        password: { type: String, required: true },
        device_token: { type: String, required: false, default: null },
        avatar_url: { type: String, required: false, default: "" },
        user_type: { 
            type: String, 
            required: false, 
            enum: ["normal_user", "seller", "admin"],
            default: "normal_user"
        },
        account_status: { 
            type: String, 
            required: false, 
            enum: ["pending", "banned", "normal"],
            default: "pending"
        },
        gender: { type: Boolean, required: false, default: false },
        address: { type: String, required: false, default: null },
    }, 
    { 
        // _id: false,
        timestamps: true 
    }
)

UserInformation.plugin(AutoIncrement, { inc_field: "user_id" })

module.exports = mongoose.model("user_information", UserInformation)