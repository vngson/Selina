const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const Permission = new mongoose.Schema(
    {
        permission_id: { type: Number },
        permission_code: { type: String, required: true, max_length: 50, unique: true },
        permission_name: { type: String, required: true, max_length: 50 },
        permission_desc: { type: String, required: false, max_length: 50, default: "" },
    }, 
    { 
        timestamps: true 
    }
)

Permission.plugin(AutoIncrement, { inc_field: "permission_id" })

module.exports = mongoose.model("permission", Permission)