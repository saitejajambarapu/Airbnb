if(process.env.NODE_ENV !="producction"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongooose = require("mongoose");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapasync.js");
const ExpressError = require("./utils/ExrpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsrouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const path = require("path");
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, "/public")));
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const MONGO_URL = process.env.ATLAS_MONGO_DB;

main().then(() => {
    console.log("connected to db");
}).catch(err => {
    console.log(e);
})
async function main() {
    await mongooose.connect(MONGO_URL);
}

// app.get("/", (req, res) => {
//     res.send("i am in root");
// })

// mongo  sesseion

const store = MongoStore.create({
    mongoUrl: MONGO_URL,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
})
store.on("error",()=>{
    console.log("Error in Mongo Session Store",err);
});
//session

const sessionoptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now()+7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    },
};





//------------------------
app.use(session(sessionoptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//------------------
// flash


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.isloggedin = req.user;
    next();
})
//-----



//-----------------------------------------------------------






app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


/// Lisings route
app.use("/listings",listingsRouter );

//reviews route
app.use("/listings/:id", reviewsrouter);

//user route
app.use("/",userRouter);




app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"))
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something Went Wrong! " } = err;
    res.status(statusCode).render("listings/error.ejs", { message })
    // res.status(statusCode).send(message);
})

app.listen(8080, () => {
    console.log("server connected");
})






































// app.get("/test",async (req,res)=>{
//     let listing = new Listing({
//         title: "GTA",
//         description:"GTA beach",
//         price:2012,
//         location:"my PC",
//         country:"India",
//     });
//     await listing.save();
//     console.log("saved the data");
//     res.send("saved successfully");
// })