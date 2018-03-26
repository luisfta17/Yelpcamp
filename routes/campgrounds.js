var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds'});
       }
    });
});

// CREATE - Add a new campground to db
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add data to campgrounds array
    var name = req.body.name;
    var price= req.body.price;
    var image= req.body.image;
    var desc= req.body.description;
    var author ={
        id: req.user._id,
        username: req.user.username
    };
    var newCampground= {name: name, price: price,  image: image, description: desc, author:author};
    // create a new campground and save to db
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
          // redirect back to campgrounds page
          console.log(newlyCreated);
        res.redirect("/campgrounds");  
        }
    });
    
});

// NEW - Show form to create a new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// Show - shows more info about a campground
router.get("/:id", function(req, res){
    // Find the Campground with the provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
            res.redirect("back");
        }else{
            console.log(foundCampground);
          // Render show template with that cmapgrpound
          res.render("campgrounds/show", {campground: foundCampground});  
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
        Campground.findById(req.params.id, function(err, foundCampground){
                  res.render("campgrounds/edit", {campground: foundCampground});
     });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
      if(err){
          res.redirect("/campgrounds");
      }else {
          res.redirect("/campgrounds/" + req.params.id);
      }
    });
    // redirect to show page
});

// Destroy Campground Route
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
