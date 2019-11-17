const router = require('express').Router();
const passport = require('passport');

router.get('/' , passport.authenticate('google', { scope: ['profile'] }) );

router.get('/redirect' ,passport.authenticate('google'), function(req, res) {
  
  // Successful authentication, redirect home.
  res.redirect('/home');
});

module.exports = router ;  
