const express = require('express');
const router =  express.Router();
const user = require('../Controllers/userController');


router.get('/:token' , user.confirmationToken);


module.exports = router ;