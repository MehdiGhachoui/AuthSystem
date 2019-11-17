const express = require('express');
const router = express.Router();
const   {ensureAuthenticated , forwardAuthenticated  } = require('../config/auth');


router.get('/' , function(req, res){
    res.render('Welcome');
});


router.get('/home'  , function(req , res){
    res.render('Dashboard');
});

router.get('/logout' , function(req , res){
    req.logout();
    res.redirect('/');
});


module.exports = router ; 
