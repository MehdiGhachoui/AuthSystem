const GoogleStrategie = require('passport-google-oauth20').Strategy;
const {google} = require('./keys');
const User = require('../Model/User');


module.exports = function(passport) {

    passport.use(new GoogleStrategie({
        clientID: google.clienID,
        clientSecret: google.clienSecret,
        callbackURL: "/auth/redirect"
      },

        function(accessToken, refreshToken, profile, done) {

            User.findOne({ googleID: profile.id }).then(function(user){

                if (user){
                    console.log("user already exist  ");
                    done(null , user)
                }
                else {
                    const newUser = new User({
                        googleID  : profile.id,
                        firstName : profile.name.givenName , 
                        lastName  : profile.name.familyName
                    })

                    newUser.save().then(function(user){
                        console.log('new user has been created' , user);
                        done(null , user)
                    })

                }

            });
        }
    ));


    passport.serializeUser(function(user , done ){
        done(null , user.id)
    })

    passport.deserializeUser(function(id , done){
        User.findById(id , function(err , user){
            done(err,user)
        })
    })

}