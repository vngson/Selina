const mongoose = require('mongoose')
const mongoose_paginate = require('mongoose-paginate')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const Product = new mongoose.Schema(
    {
        product_id: { type: Number },
        seller_id: { type: Number, required: true },
        name: { type: String, required: true, max_length: 100 },
        desc: { type: String, max_length: 2000, default: "-----" },
        author: { type: String, max_length: 200, default: "-----" },
        price: { type: Number, required: true },
        image: { type: String },
        status: { 
            type: String, 
            required: false, 
            enum: ["rejected", "approved", "pending"],
            default: "pending"
        },
        genres: { type: Array, default: []},
        quantity: { type: Number, required: true, default: 0 },
        is_deleted: { type: Boolean, required: false, default: false}
    }, 
    { 
        timestamps: true 
    }
)

Product.plugin(mongoose_paginate)
Product.plugin(AutoIncrement, { inc_field: "product_id" })

module.exports = mongoose.model("product", Product)