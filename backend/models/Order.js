const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    stockName: String,
    quantity: Number,
    price: Number,
    type: { type: String, enum: ['BUY', 'SELL'] }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
