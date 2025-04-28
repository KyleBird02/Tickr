const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 10000 },
    portfolio: [
        {
            stockName: String,
            quantity: Number,
            boughtPrice: Number 
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
