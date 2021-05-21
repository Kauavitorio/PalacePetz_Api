const express = require('express');
const router = express.Router();
const Controller = require('../controllers/shoppingcartController')

router.get('/:id_user', Controller.GetCartUser)

router.get('/size/:id_user', Controller.GetCartSize)

router.post('/insert', Controller.InsertUserCart)

router.delete('/remove/:id_user/:cd_prod', Controller.RemoveItemFromCart)

router.patch('/update/amount/:cd_prod/:product_amount/:totalPrice/:sub_total/:id_user', Controller.UpdateCartToNewAmount)

module.exports = router