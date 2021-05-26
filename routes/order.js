const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController')

//  Router to create order from user request
router.post('/finish-order', OrderController.FinishOrder);

//  Get user Orders
router.get('/:id_user', OrderController.GetAllOrders);

module.exports = router