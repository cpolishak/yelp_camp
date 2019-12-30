var express = require("express");
var router = express.Router({mergeParams: true});

var passport = require("passport");
var User = require("../models/user");

// creates a GET route route for the home/root page (in this case localhost:3000).
router.get('/', function(req, res){
    res.render('landing.ejs')
});

// show register form
router.get("/register", function(req, res) {
    res.render("register");
}) 
// handle sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function (err, user){
        if(err) {
            req.flash("error", err.message);
            // console.log(err);
            return res.redirect("register");
        } 
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to Camping Searcher " + user.username);
            // console.log("user authenticated")
            res.redirect("/campgrounds");
        });
    });
});

// show login form
router.get("/login", function(req, res) {
    res.render("login");
});

// handle login logic & logs user in
// passport.authenticate before the function is the middleware for authentication
router.post("/login", passport.authenticate("local", 
    {successRedirect: "/campgrounds",
    failureRedirect: "/login"
    }), function(req, res) {
    // res.send("Login logic here");
});

// logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});


module.exports = router;