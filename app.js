require('dotenv').config();

// console.log(process.env.CLOUDINARY_CLOUD_NAME);
// console.log(process.env.CLOUDINARY_API_KEY);
// console.log(process.env.CLOUDINARY_API_SECRET);


const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const ExpressError = require('./utils/expressError');
const path = require("path");
const methodOverride = require('method-override');
const flash = require('connect-flash');

const users = require("./routes/users");
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/users");


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error",console.error.bind(console,"Connection error"));
db.once("open",()=> {
    console.log("Database connected successfully");
    });

const app = express();
const port = 3000;

app.engine('ejs', ejsMate)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))


const sessionConfig = {
    secret: "thisshouldbeabettersecret!",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get("/", (req, res)=>{
    res.render("home");
})

app.use("/", users);
app.use("/campgrounds", campgrounds);
app.use('/campgrounds/:id/reviews', reviews );





app.all("*",(req, res, next)=>{
    next(new ExpressError("page not found", 404))
})
app.use((err, req, res, next)=>{
    const { statusCode = 500 }= err;
    if(!err.message) err.message = "oh boy! something went wrong";
    res.status(statusCode).render("campgrounds/error", {err});
})

app.listen(port, ()=>{
    console.log(`http://localhost:${port}`);
})
