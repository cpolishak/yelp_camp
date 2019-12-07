var express = require('express');
var app = express();
var mongoose = require("mongoose");
// need cors to avoid any cross origin issues if any
var cors = require('cors');
// need body parser to use with our POST request
var bodyParser = require('body-parser');
var Campground = require('./models/campground');
var Comment = require('./models/comment');
var seedDB = require('./seeds.js');

seedDB();
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });


app.use(bodyParser.urlencoded({extended:true}));
// Also need the ^^^ app.use(bodyParser.urlencoded({extended:true})); any time we use body-parser. 

app.set('view engine', 'ejs');
//Using __dirname protects the source for if the path is different
app.use(express.static(__dirname + "/public"))



// Campground.create(
//     {
//         name: "Granite Hill",
//         image: "https://photosforclass.com/download/flickr-1430198323",
//         description: "This is a huge hill. It has lovely views at night and some fantastic beasts wandering the mountainsides"
//     }, function(err, campground) {
//         if(err) {
//             console.log(err);
//         } else {
//             console.log("Newly Created Campground: ");
//             console.log(campground);
//         }
//     });

var campgrounds = [
    {name: "Salmon Creek", image: "https://photosforclass.com/download/flickr-7842069486"},
    {name: "Granite Hill", image: "https://photosforclass.com/download/flickr-1430198323"},
    {name: "Mountain Goats Rest", image: "https://photosforclass.com/download/flickr-2770459706"}
];

// creates a GET route for the home/root page (in this case localhost:3000).
app.get('/', function(req, res){
    res.render('landing.ejs')
});

// Creates a GET route to send the below data to the campgrounds.ejs file. (Using res.render to show the page)
// INDEX - show all campgrounds
app.get('/campgrounds', function(req, res) {
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds) {
        if(err) {
            console.log(err);
        } else {
            res.render("campgrounds/index.ejs", {campgrounds: allCampgrounds});
        }
    })
});
    // Create an array of objects with name of camping spot and a picture (not really from those places. I just chose them from https://photosforclass.com/search?text=camping). 
    // var campgrounds = [
    //     {name: "Salmon Creek", image: "https://photosforclass.com/download/flickr-7842069486"},
    //     {name: "Granite Hill", image: "https://photosforclass.com/download/flickr-1430198323"},
    //     {name: "Mountain Goats Rest", image: "https://photosforclass.com/download/flickr-2770459706"}
    // ]
        // res.render("campgrounds", {campgrounds: campgrounds});    
// });

// Create a POST route for users to add new data into the campgrounds results page. Will later be able to have these saved into the DB to be able to access where we(the users in this case) left off.
// CREATE - add new campground to DB
app.post('/campgrounds', function(req, res){
    // can use the "you hit the post route" below to check the route in Postman using a POST request to localhost:3000/campgrounds. it will display that message.
        // res.send("You hit the post route!")
    // Get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    // new object to contain info from campgrounds array up top on page (outside of this app.post for now until we move to a DB).
    var newCampground = {name: name, image: image, description:desc }
    // new campground into the campgrounds array below. To push in a new object
        // campgrounds.push(newCampground)
    // Create a new campground and save to DB -
    Campground.create(newCampground, function(err, newlyCreated) {
        if(err) {
            console.log(err);
        } else {
            // Redirect back to the campgrounds page
            res.redirect("/campgrounds");
        }
    })
    // redirect back to campgrounds page. YES we have two campgrounds routes (POST and GET), ***but the default on a redirect is to the GET route**
        // res.redirect('/campgrounds')
});

// Creates a GET route for the new.ejs page where we add in new data to the campgrounds array.
app.get('/campgrounds/new', function(req, res){
    res.render("campgrounds/new.ejs")
});

//This below needs to go after the campgrounds/new route, because the :id can be anything (even the word new, which would cause issues because it would treat the campgrounds/new as a /:id route.)
// SHOW Route - shows more info about one campground
app.get('/campgrounds/:id', function(req, res){
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

// =============
// COMMENTS ROUTES
// =============

app.get("/campgrounds/:id/comments/new", function(req, res) {
    //Find campground by id
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new.ejs", {campground: campground});
        }
    })
});

app.post("/campgrounds/:id/comments", function(req, res){
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
         Comment.create(req.body.comment, function(err, comment){
            if(err){
                console.log(err);
            } else {
                // push the comment, then save it, then redirect back to that campground's page to see your comments
                campground.comments.push(comment);
                campground.save();
                res.redirect('/campgrounds/' + campground._id);
            }
         });
        }
    });
    //create new comment
    //connect new comment to campground
    //redirect campground show page
 });


// use process.env.PORT || 3000 so that anyone can get on that route to access data (not just me on this machine)
app.listen(process.env.PORT || 3000, function() {
    console.log('YelpCamp has Started')
});

// === GENERAL INFO ===
// Recipe: form to send a post request, inside that post route we take the form data and do something with it, then redirect somewhere else.