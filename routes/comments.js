var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require("../middleware");

// Comments New 
router.get("/new", middleware.isLoggedIn, function(req, res) {
    //Find campground by id
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new.ejs", {campground: campground});
        }
    })
});

// Comments Create
router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
         Comment.create(req.body.comment, function(err, comment){
            if(err){
                req.flash("error", "Something went wrong")
                console.log(err);
            } else {
                // add username and id to comment
                // console.log("New comment's username will be : " + req.user.username);
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                // save comment
                comment.save();
                // push the comment, then save it, then redirect back to that campground's page to see your comments
                campground.comments.push(comment);
                campground.save();
                console.log(comment);
                req.flash("success", "Successfully added comment")
                res.redirect('/campgrounds/' + campground._id);
            }
         });
        }
    });
 });

 // COMMENT EDIT ROUTE
 router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res ) {
     //  we have to make sure to access the campground_id to avoid 1 error. 
     // And we have to 
     Comment.findById(req.params.comment_id, function(err, foundComment) {
         if(err) {
             res.redirect("back");
         } else {
            // campground_id corresponds with the same named ejs in our edit.ejs (for comments) in the action path defined in the form on that page
             res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
         }
     });
 });

// COMMENTS UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    // res.send("You hit the update route for comments")
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if(err) {
            res.redirect("back")
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// COMMENT DESTROY ROUTE
// method.override allows us to use the .delete below to make the deletion and the override in the ejs in the action path
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    // findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted")
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
    // res.send("This is to destroy a comment");
});

module.exports = router;