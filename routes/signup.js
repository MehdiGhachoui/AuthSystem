const   express = require("express");
const   user = require('../Controllers/userController')
const   router = express.Router();


router.get('/' , function(req , res){
    res.render('signup')
})

router.post('/' , user.signup );


module.exports = router ; 