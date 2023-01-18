const mongoose = require('mongoose')
const mongoose_paginate = require('mongoose-paginate')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const BookGroup = new mongoose.Schema(
    {
        group_id: { type: Number },
        buyer_id: { type: Number, required: true },
        seller_id: { type: Number, required: true },
        is_deleted: { type: Boolean, required: false, default: false },
    }, 
    { 
        timestamps: true 
    }
)

BookGroup.plugin(mongoose_paginate)
BookGroup.plugin(AutoIncrement, { inc_field: "group_id" })

module.exports = mongoose.model("book_group", BookGroup)