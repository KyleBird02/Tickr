const Stock = require('../models/Stock');

exports.getAllStocks = async (req, res) => {
    try {
        const stocks = await Stock.find();
        res.json(stocks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getStockByName = async (req, res) => {
    try {
        const stock = await Stock.findOne({ Name: req.params.name });
        if (!stock) {
            return res.status(404).json({ message: 'Stock not found' });
        }
        res.json(stock);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// GET /api/stocks/latest
exports.getLatestStockPrices = async (req, res) => {
    try {
        const stocks = await Stock.find();

        const priceMap = {};
        stocks.forEach(stock => {
            priceMap[stock.Name] = stock.close;
        });

        res.json(priceMap);
    } catch (error) {
        console.error('Error fetching latest stock prices:', error);
        res.status(500).json({ error: error.message });
    }
};

