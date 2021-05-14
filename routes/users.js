const express = require('express');
const router = express.Router();
const multer = require('multer');
const UsersController = require('../controllers/userController')
const CardController = require('../controllers/cardsController')

//  Register User
router.post('/register', UsersController.RegisterUsers);

// Login User
router.post('/login', UsersController.Login);

// Update Address
router.patch('/update/address/', UsersController.UpdateAddress)

// Update Profile Image
router.patch('/update/profile/image/', UsersController.UpdateProfileImage)

// Update Profile
router.patch('/update/profile', UsersController.UpdateProfile)

//  Confirm E-mail
router.get('/confirm/email/:verify_id/:id_user', UsersController.ConfirmEmail)

//  Reset Password request
router.post('/request/password/', UsersController.RequestPasswordReset)

//  Change Password
router.post('/change/password/', UsersController.ChangePassword)

/*----------- Cards Action ---------------*/

// Register new Card
router.post('/register/card', CardController.RegisterNewCard)

//  Change Password
router.get('/cards/list/:id_user', CardController.GetUserCards)

module.exports = router