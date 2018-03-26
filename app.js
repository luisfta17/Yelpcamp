var express      = require("express"), 
    app          = express(),
    bodyParser   = require("body-parser"),
    mongoose     = require("mongoose"),
    passport     = require("passport"),
    flash        = require("connect-flash"),
LocalStrategy    = require("passport-local"),
methodOverride   = require("method-override"),
    Campground   = require("./models/campground"),
    Comment      = require("./models/comment"),
    User         = require("./models/user"),
    seedDB       = require ("./seeds");
    
// require routes
var commentRoutes = require("./routes/comments"),
campgroundsRoutes = require("./routes/campgrounds"),
indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_campv14");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');
// seedDB();
// PASSPORT CONFIGURATION.

app.use(require("express-session")({ 
    secret: "yo me llamo luis",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error= req.flash("error");
    res.locals.success= req.flash("success");
    next();
});

app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/", indexRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp is Running");
});