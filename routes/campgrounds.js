var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
// the path on the require for the middleware doesn't need to include /index.js because express is already going to look for that file when it searches the directory
var middleware = require("../middleware");

// Creates a GET route to send the below data to the campgrounds.ejs file. (Using res.render to show the page)
// INDEX - show all campgrounds
router.get('/', function(req, res) {
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index.ejs", {campgrounds: allCampgrounds});
        }
    })
});

// Create a POST route for users to add new data into the campgrounds results page. Will later be able to have these saved into the DB to be able to access where we(the users in this case) left off.
// CREATE / POST - add new campground to DB
router.post('/', middleware.isLoggedIn, function(req, res){
    // can use the "you hit the post route" below to check the route in Postman using a POST request to localhost:3000/campgrounds. it will display that message.
        // res.send("You hit the post route!")
    // Get data from form and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    // new object to contain info from campgrounds array up top on page (outside of this router.post for now until we move to a DB).
    var newCampground = {name: name, price: price, image: image, description:desc, author:author }
    console.log(req.user);
    // new campground into the campgrounds array below. To push in a new object
        // campgrounds.push(newCampground)
    // Create a new campground and save to DB -
    Campground.create(newCampground, function(err, newlyCreated) {
        if(err) {
            console.log(err);
        } else {
            console.log(newlyCreated)
            // Redirect back to the campgrounds page
            res.redirect("/campgrounds");
        }
    })
    // redirect back to campgrounds page. YES we have two campgrounds routes (POST and GET), ***but the default on a redirect is to the GET route**
        // res.redirect('/campgrounds')
});

// NEW - shows form to get new campground (Creates a GET route for the new.ejs page where we add in new data to the campgrounds array.)
router.get('/new', middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new.ejs")
});

//This below needs to go after the campgrounds/new route, because the :id can be anything (even the word new, which would cause issues because it would treat the campgrounds/new as a /:id route.)
// SHOW Route - shows more info about one campground
router.get('/:id', function(req, res){
    // Find the campground with provided ID. Then populating comments and then executing the function for error or to show the campgrounds found.
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err) {
            console.log(err);
        } else {
            console.log(foundCampground)
            // render the show template with that campground
            res.render("campgrounds/show.ejs", {campground: foundCampground});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
        
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    // redirect somewhere (show page in this case)
})

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds");
       }
    });
 });

module.exports = router;