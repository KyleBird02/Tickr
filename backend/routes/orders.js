const express = require('express');
const { placeOrder, getPortfolio } = require('../controllers/orderController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes
router.post('/', authenticate, placeOrder);
router.get('/portfolio', authenticate, getPortfolio);

module.exports = router;
