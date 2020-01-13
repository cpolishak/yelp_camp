var express = require('express');
var app = express();
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require('passport');
var LocalStrategy = require('passport-local');
var methodOverride = require('method-override');
// need cors to avoid any cross origin issues if any
var cors = require('cors');
// need body parser to use with our POST requests
var bodyParser = require('body-parser');
var Campground = require('./models/campground');
var Comment = require('./models/comment');
var User = require("./models/user");
var seedDB = require('./seeds.js');
require("dotenv").config({path: "/.env"});  // changed and added / to path

// Requiring routes for router vars in other js pages
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index")

// seedDB();  // seed the Database

// console.log(process.env.devdbURL);
// mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
// mongoose.connect(process.env.MONGODB_URL);
console.log(process.env.MONGODBURL);
mongoose.connect("mongodb+srv://Cpolish:uyw9Rgp1nVW5eGhw@campingsearcher-zitpj.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log(err));   


app.use(bodyParser.urlencoded({extended:true}));
// Also need the ^^^ app.use(bodyParser.urlencoded({extended:true})); any time we use body-parser. 

app.set('view engine', 'ejs');
//Using __dirname protects the source for if the path is different
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.locals.moment = require('moment');

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// this is a shortcut for us to get the current user with less code in all the places it will be used.
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// var campgrounds = [
//     {name: "Salmon Creek", image: "https://photosforclass.com/download/flickr-7842069486"},
//     {name: "Granite Hill", image: "https://photosforclass.com/download/flickr-1430198323"},
//     {name: "Mountain Goats Rest", image: "https://photosforclass.com/download/flickr-2770459706"}
// ];

// adding the "/comments", "/campgrounds", etc. helps dry up the code and we can remove these paths from the app.get/use/post, etc. in their respective paths
// just replace them with "/"
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// use process.env.PORT || 3000 so that anyone can get on that route to access data (not just me on this machine)
app.listen(process.env.PORT || 3000, function() {
    console.log('Camping Searcher has Started')
});


// === GENERAL INFO ===
// Recipe: form to send a post request, inside that post route we take the form data and do something with it, then redirect somewhere else.