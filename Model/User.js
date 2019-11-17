const mongoose = require('mongoose');


// Creating  Schema 
let userSchema = mongoose.Schema({
   
    firstName : { type : String , required : true },
    lastName  : { type : String , required : true },
    email     : { type : String  },
    password  : { type : String  },
    isVerified: { type: Boolean, default: false },
    passwordResetToken : { type : String  },
    passwordResetExpires : { type : Date  },
    googleID  : {type : String}
    
});

// Creating  Model 
let userModel =  mongoose.model('User' , userSchema , 'users');


module.exports  =  userModel ; 