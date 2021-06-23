const express = require('express');
const router = express.Router();
const multer = require('multer');
const HashController = require('../controllers/hashController')

//  Password Test
router.post('/password', HashController.TestTimeToHash);

module.exports = router;