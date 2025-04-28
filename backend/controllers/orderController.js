const User = require('../models/User');
const Order = require('../models/Order');
const Stock = require('../models/Stock');

exports.placeOrder = async (req, res) => {
    const { stockName, quantity, type } = req.body;
    const userId = req.user.id;

    try {
        const stock = await Stock.findOne({ Name: stockName });
        if (!stock) return res.status(404).json({ message: 'Stock not found' });

        const price = stock.close;
        const totalCost = quantity * price;

        const user = await User.findById(userId);

        if (type === 'BUY') {
            if (user.balance < totalCost) {
                return res.status(400).json({ message: 'Insufficient balance' });
            }

            user.balance -= totalCost;

            const ownedStock = user.portfolio.find(s => s.stockName === stockName);

            if (ownedStock) {
                // 🧠 Weighted average bought price
                const totalValue = (ownedStock.quantity * ownedStock.boughtPrice) + (quantity * price);
                const newQuantity = ownedStock.quantity + quantity;
                ownedStock.boughtPrice = totalValue / newQuantity;
                ownedStock.quantity = newQuantity;
            } else {
                // 🧠 Save boughtPrice for new stock
                user.portfolio.push({ stockName, quantity, boughtPrice: price });
            }
        } 
        else if (type === 'SELL') {
            const ownedStock = user.portfolio.find(s => s.stockName === stockName);
            if (!ownedStock || ownedStock.quantity < quantity) {
                return res.status(400).json({ message: 'Insufficient shares' });
            }

            ownedStock.quantity -= quantity;
            user.balance += totalCost;

            if (ownedStock.quantity === 0) {
                user.portfolio = user.portfolio.filter(s => s.stockName !== stockName);
            }
        } 
        else {
            return res.status(400).json({ message: 'Invalid order type' });
        }

        await user.save();

        const order = await Order.create({
            userId,
            stockName,
            quantity,
            price,
            type
        });

        res.status(201).json({ message: 'Order placed', order });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getPortfolio = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({
            balance: user.balance,
            portfolio: user.portfolio
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
