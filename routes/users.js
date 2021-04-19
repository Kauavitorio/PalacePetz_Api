const express = require('express');
const router = express.Router();
const multer = require('multer');
const UsersController = require('../controllers/userController')

//  Register User
router.post('/register', UsersController.RegisterUser);