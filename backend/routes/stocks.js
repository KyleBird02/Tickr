const express = require('express');
const { getAllStocks, getStockByName , getLatestStockPrices} = require('../controllers/stockController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/latest', getLatestStockPrices); // ✅ first
router.get('/', getAllStocks);
router.get('/:name', getStockByName); 

module.exports = router;
