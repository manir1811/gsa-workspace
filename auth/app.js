var express = require("express");
var app = express();
var mongoose = require("mongoose");
var User = require("./models/user");
var passport = require("passport");
var bodyParser = require("body-parser");
var localStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");


mongoose.connect('mongodb://localhost/auth');

app.use(require("express-session")({
    secret: 'testing auth',
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());

app.get('/', function(req, res){
    res.render('home');
});

app.get('/s', function(req,res){
    res.render("secret");
});

app.listen(process.env.PORT,process.env.IP, function(){
    console.log("Server started");
});