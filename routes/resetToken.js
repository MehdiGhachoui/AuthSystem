const express = require('express');
const router = express.Router();
const user = require('../Controllers/userController')


router.post('/', user.resetToken);

module.exports = router ;
