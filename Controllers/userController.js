const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const User =  require('../Model/User');
const Token = require('../Model/TokenVerification');
const {auth} = require('../config/auth');



module.exports.signup = function(req , res ){

    const { firstName, lastName, email, password, password2 } = req.body;
    let errors = [];
  
    if (!firstName || !lastName || !email || !password || !password2) {
      errors.push({ msg: 'Please enter all fields' });
    }
  
    if (password != password2) {
      errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }
  
    if (errors.length > 0) {
      res.render('signup', {errors});
    }

    else{
        User.findOne({ email: email } , function (err , user ) {
            if (user) {
              errors.push({ msg: 'Email already exists' });
              res.render('signup', { errors });
            } else {
                
                let newUser = new User({
                    firstName : req.body.firstName,
                    lastName  : req.body.lastName,
                    email     : req.body.email,
                    password  : req.body.password
                });
        
                bcrypt.genSalt(10 , function(err , salt){

                  bcrypt.hash(newUser.password , salt , function(err , hash){
                    if (err) throw err;
                    newUser.password = hash ;
                    newUser.save(function(err){
                      if(err) throw err ;
                            
                      // Create a verification token for this user
                      var token = new Token({ _userId: newUser._id, token: crypto.randomBytes(16).toString('hex') });

                      // Save the verification token
                      token.save(function (err) {
                                
                        if (err) throw err ; 
                              
                        else {
                          // Send the email
                          var transporter = nodemailer.createTransport({ service: 'gmail', host: 'smtp.gmail.com', auth: { user: auth.email , pass: auth.pass } });
                          var mailOptions = { from: 'no-reply@yourwebapplication.com', to: newUser.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/localhost:3000\/confirmation\/' + token.token + '.\n' };
                          transporter.sendMail(mailOptions, function (err) {
                            if (err) { 
                              // use flash messages
                              errors.push({msg : 'email  not sent'})
                              res.render('signup' , {errors})
                            }
                            else res.render('retry' , {email : newUser.email});
                          });
                        }
                      });

                          
                    }); 
                  });
                });

                
            } 
        });
    }

}



module.exports.confirmationToken = function(req , res){

  let errors = []
  
    Token.findOne({ token: req.params.token }, function (err, token) {
        if (!token) {
          errors.push({msg : 'We were unable to find a valid token. Your token my have expired.' })
          res.render('error' , {errors})
          // return console.log(  'We were unable to find a valid token. Your token my have expired.' );
        }
        else {
          // If we found a token, find a matching user
          User.findOne({ _id: token._userId }, function (err, user) {
              if (!user){
                errors.push({msg : 'We were unable to find a user for this token.' })
                res.render('error' , {errors})
                // return console.log( 'We were unable to find a user for this token.' );
              }

              if (user.isVerified) {
                errors.push({msg : 'This user has already been verified.' })
                res.render('error' , {errors})
                // console.log( 'This user has already been verified.' );
              }

              // Verify and save the user
              user.isVerified = true;
              user.save(function (err) {
                  if (err) { console.log( err ) }
                  console.log("The account has been verified. Please log in.");
                });
          });
        }
    });

}




module.exports.resetToken = function (req , res){

  const  email = req.body.email ;
    let errors = [];
  

  if (!email){
    errors.push({msg : "please enter your email"})
  }
  

  if (errors.length > 0) {
    res.render('retry' , {errors})
  }


  else { 

    User.findOne({ email: req.body.email }, function (err, user) {
      
      if (!user) {
        errors.push( {msg : 'We were unable to find a user for this token.' });
        res.render('retry' , {errors})
      }
      
      if (user.isVerified){ 
        errors.push( {msg : 'This user has already been verified.' });
        res.render('retry' , {errors})
      }

      else {
        // Create a verification token, save it, and send email
        var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

        // Save the token
        token.save(function (err) {
            if (err) { 
              console.log( err.message ); 
            }

            // Send the email
            var transporter = nodemailer.createTransport({ service: 'gmail', host: 'smtp.gmail.com', auth: { user: auth.email , pass: auth.pass } });
            var mailOptions = { from: 'no-reply@yourwebapplication.com', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/localhost:3000\/confirmation\/' + token.token + '.\n' };
            transporter.sendMail(mailOptions, function (err) {
                if (err) { console.log('mail error : ' , err); }
                else res.render('retry' , {email : user.email});
            });

        });
      }
    });

  }

};

