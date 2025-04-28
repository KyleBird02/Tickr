const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
    Name: { type: String, unique: true },
    date: String,
    close: Number
});

module.exports = mongoose.model('Stock', StockSchema);
