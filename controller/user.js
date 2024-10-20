const User = require("../models/user.js");

module.exports.signUpRedirect = (req,res)=>{
    res.render("user/signup.ejs")
}

module.exports.newUser = async(req,res)=>{
    try{
        let{username, email, password }=req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser,password);
        req.login(registeredUser, (err)=>{
            if(err){
                next(err);
            }
            req.flash("success","Welcome to Wonderlust");
        res.redirect("/listings");
        })
        
    }catch(er){
        req.flash("error",er.message);
        res.redirect("/signup");
    }
    
}

module.exports.saveUser = (req,res)=>{
    req.flash("success","welcome Back");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.loginRedirect = (req,res)=>{
    res.render("user/login.ejs")
}

module.exports.logOutUser = (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged you out!");
        res.redirect("/listings");
    })
}