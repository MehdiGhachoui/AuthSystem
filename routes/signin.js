const   express  = require("express");
const   passport = require('passport');
const   router   = express.Router();


router.get('/' , function(req , res){
    res.send('signin')
})

router.post('/' , function(req , res , next){
   passport.authenticate('local', {
       successRedirect : '/home',
       failureRedirect : '/',
       failureFlash : true
   })(req,res,next);
});

module.exports = router ; 


