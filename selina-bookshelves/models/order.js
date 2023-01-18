const mongoose = require('mongoose')
const mongoose_paginate = require('mongoose-paginate')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const Order = new mongoose.Schema(
    {
        order_id: { type: Number, required: false},
        buyer_id: { type: Number, require: true },
        seller_id: { type: Number, require: true },
        book_group_id: { type: Number, require: true },
        status: { 
            type: String,
            required: false, 
            enum: ["rejected", , "delivering", "waiting", "delivered", "cancelled"],
            default: "waiting"
        },
        delivered_to: { type: String, required: true },
        phone_number : { type: String, required: true },
        total_price: { type: Number, required: true },
        payment_method: { type: String, default: "direct_payment"}
    }, 
    { 
        timestamps: true 
    }
)

Order.plugin(mongoose_paginate)
Order.plugin(AutoIncrement, { inc_field: "order_id" })

module.exports = mongoose.model("order", Order)