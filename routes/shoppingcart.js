const express = require('express');
const router = express.Router();
const Controller = require('../controllers/shoppingcartController')

router.get('/:id_user', Controller.GetCartUser)

router.get('/size/:id_user', Controller.GetCartSize)

router.post('/insert', Controller.InsertUserCart)

module.exports = router