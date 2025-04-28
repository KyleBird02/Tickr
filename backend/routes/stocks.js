const express = require('express');
const { getAllStocks, getStockByName } = require('../controllers/stockController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getAllStocks);
router.get('/:name', getStockByName);

module.exports = router;
