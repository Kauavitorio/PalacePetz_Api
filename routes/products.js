const express = require('express');
const router = express.Router();
const ProductsController = require('../controllers/productsController')

// Register Products
router.post('/register', ProductsController.RegisterNewProduct)

// List Products
router.get('/list', ProductsController.ListAllProducts)

module.exports = router