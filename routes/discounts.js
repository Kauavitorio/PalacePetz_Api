const express = require('express');
const router = express.Router();
const DiscountsController = require('../controllers/discountsController')

router.get('/apply/:name_tag/:id_user', DiscountsController.ApplyDiscount)

module.exports = router;