const express = require('express');
const router = express.Router();
const ProductsController = require('../controllers/productsController')

// Register Products
router.post('/register', ProductsController.RegisterNewProduct)

module.exports = router