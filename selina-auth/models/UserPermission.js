const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const UserPermission = new mongoose.Schema(
    {
        user_permission_id: { type: Number },
        user_id: { type: Number, required: true },
        permission_code: { type: String, required: true, max_length: 50 },
        is_deleted: { type: Boolean, required: false, default: false }
    }, 
    { 
        timestamps: true 
    }
)

UserPermission.plugin(AutoIncrement, { inc_field: "user_permission_id" })

module.exports = mongoose.model("user_permission", UserPermission)