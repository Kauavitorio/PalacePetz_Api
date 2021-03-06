const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController')

//  Router to create order from user request
router.post('/finish-order', OrderController.FinishOrder);

//  Get user Orders
router.get('/:id_user', OrderController.GetAllOrders);

//  Get user Order Detials
router.get('/details/:id_user/:cd_order', OrderController.GetOrderDetails);

//  Get last user Orders
router.get('/last/:id_user', OrderController.GetLastOrders);

module.exports = router