const mongoose = require('mongoose')
const mongoose_paginate = require('mongoose-paginate')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const BookInCart = new mongoose.Schema(
    {
        book_in_cart_id: { type: Number },
        book_id: { type: Number, required: true },
        book_group_id: { type: Number, required: true },
        quantity: { type: Number, required: true },
        name: { type: String, required: true, max_length: 100 },
        desc: { type: String, max_length: 500, default: "-----" },
        author: { type: String, max_length: 200, default: "-----" },
        image: { type: String },
        price: { type: Number, required: true },
        is_deleted: { type: Boolean, required: false, default: false },
    }, 
    { 
        timestamps: true 
    }
)

BookInCart.plugin(mongoose_paginate)
BookInCart.plugin(AutoIncrement, { inc_field: "book_in_cart_id" })

module.exports = mongoose.model("book_in_cart", BookInCart)