const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryController')


// Register Category
router.post('/register', CategoryController.RegisterCategory);

module.exports = router