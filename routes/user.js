const express = require("express");
const wrapasync = require("../utils/wrapasync");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const UserController = require("../controller/user.js");

//signup

router.route("/signup")
  .get(UserController.signUpRedirect)
  .post(wrapasync(UserController.newUser));

  // login

router.route("/login")
.get(UserController.loginRedirect)
.post(saveRedirectUrl,passport.authenticate("local",{
    failureRedirect: "/login",
    failureFlash: true
}),UserController.saveUser);



router.get("/logout",UserController.logOutUser)


module.exports = router;