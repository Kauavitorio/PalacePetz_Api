const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController')


// Register Category
router.post('/register', CategoryController.RegisterCategory);

//List Category
router.get('/list', CategoryController.ListCategory);

module.exports = router