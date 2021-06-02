const express = require('express');
const router = express.Router();
const ProductsController = require('../controllers/productsController')

// Register Products
router.post('/register', ProductsController.RegisterNewProduct)

// List Products
router.get('/list', ProductsController.ListAllProducts)

router.get('/list/filter/popular', ProductsController.ListAllPopularProducts)

router.get('/details/:cd_prod', ProductsController.GetProductDetails)

// List Products by biggest price
router.get('/list/filter/biggestprice', ProductsController.ListProductsByBiggestPrice)

// List Products by biggest price
router.get('/list/filter/lowestprice', ProductsController.ListProductsByLowestPrice)

// List Products with category filter
router.get('/list/filter/category/:cd_category', ProductsController.ListProductsByCategory)

// List Products with species filter
router.get('/list/filter/species/:species', ProductsController.ListProductsBySpecies)

// List Products with product name
router.get('/list/filter/name/:nm_product', ProductsController.ListProductsByName)

module.exports = router