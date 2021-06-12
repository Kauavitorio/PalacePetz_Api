const express = require('express');
const router = express.Router();
const multer = require('multer');
const UsersController = require('../controllers/userController')
const CardController = require('../controllers/cardsController')
const PetsController = require('../controllers/petsController')

//  Register User
router.post('/register', UsersController.RegisterUsers);

// Login User
router.post('/login', UsersController.Login);

// Register Product Historic User
router.post('/register-historic-product/:id_user/:cd_prod', UsersController.Register_Product_On_User_Historic);

// Get User Product Historic
router.get('/historic-product/:id_user', UsersController.GetUserHistoric);

// Clear User Product Historic
router.delete('/historic-product/:id_user', UsersController.ClearHistoric);

// Update Address
router.patch('/update/address/', UsersController.UpdateAddress)

//  Update Username
router.patch('/update/username', UsersController.UpdateUserName)

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

//  Delete User Card
router.delete('/card/remove/:id_user/:cd_card', CardController.RemoveUserCard) // End Cards Actions


/*----------- Pets Actions ---------------*/
//  Insert new pet for user
router.post('/pet/insert', PetsController.Insert_New_Pet) 

//  Get User Pet
router.get('/pet/:id_user', PetsController.GetPets) 

//  Edit User Pet
router.patch('/pet/update', PetsController.Edit_User_Pet) 

//  Remover User Pet
router.delete('/pet/remove/:cd_animal/:id_user', PetsController.Remove_User_Pet) // End Pets Actions

module.exports = router