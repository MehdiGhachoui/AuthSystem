const localStrategy  = require('passport-local').Strategy;
const bcrypt         = require('bcryptjs');
const User           = require('../Model/User');


module.exports = function(passport){

    passport.use(
        new localStrategy({usernameField:'email'} , function(email , password , done){
            User.findOne({email : email} , function(err , user){
                if (err) console.log(err) ; 
                if(!user){
                    return done(null , false , {msg : "email not found"})
                }
                else{
                    bcrypt.compare(password , user.password , function(err , isMatch){
                        if(err) console.log(err); 
    
                        if (isMatch){
                            return done(null , user)
                        }else{
                            return done(null , false , {msg : "password incorrect "})
                        }
                    })
                }
                
            })
        })
    )

    passport.serializeUser(function(user , done ){
        done(null , user.id)
    })

    passport.deserializeUser(function(id , done){
        User.findById(id , function(err , user){
            done(err,user)
        })
    })
}