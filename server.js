const   express = require("express");
const   path = require('path');
const   bodyParser = require('body-parser');
const   mongoose = require('mongoose');
const   session = require('express-session');
const   {mongoURI} = require('./config/keys');
const   passport = require('passport');
const   cookieSession = require('cookie-session');
const   app     = express() ; 

require('./config/passport')(passport);
require('./config/passport-google')(passport);

//  DataBase connection  : 

mongoose.connect(mongoURI);
let db = mongoose.connection ; 

// connection success : 

db.on("open" , function(){
    console.log('connected');
})

// connection error  : 

db.on("error" , function(err){
    console.log("connection error :  ", err);
})


// static files :
app.use(express.static(path.join(__dirname, '/public/')));

// view engine setup : 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



// body-parser :
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));


// app.use(expressValidator());

//  Express Session
app.use ( session({ 
        secret : "keyboard cat",
        resave: true,
        saveUninitialized: true
    })
);


app.use(passport.initialize());
app.use(passport.session());


// Global variables :
app.use(function(req,res,next){
    res.locals.user = req.user || null;
    next();
})


//Routes :
app.use('/' , require('./routes/index'));

app.use('/signup' , require('./routes/signup'));

app.use('/signin' , require('./routes/signin'));

app.use('/confirmation', require('./routes/confirmationToken'));

app.use('/auth' , require('./routes/auth-google'));

app.use('/resend' , require('./routes/resetToken'))




app.listen(3000 , function(req,res){
    console.log('Running on port 3000 !');
});

