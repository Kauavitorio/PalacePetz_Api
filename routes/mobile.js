const express = require('express');
const router = express.Router();
const Controller = require('../controllers/mobileController')

router.get('/version', Controller.GetMobileVersion)

module.exports = router