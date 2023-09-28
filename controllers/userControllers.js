const userCollection = require("../models/userSchema");

//checking session availability 
module.exports.getUserRoute = (req, res) => {
  if (req.session.user) {
    res.redirect("/user/userDashboard");
  } else {
    res.render("userLogin");
  }
};

//authenticating user credentials
module.exports.postLogin = async (req, res) => {
  const data = await userCollection.findOne({ email: req.body.email });
  if (data) {
    if (req.body.email !== data.email) {
      res.render("userLogin", { subreddit: "incorrect email" });
    } else if (req.body.password !== data.password) {
      res.render("userLogin", { subreddit: "incorrect password" });
    } else if (req.body.password !== data.password) {
      res.render("userLogin", { subreddit: "incorrect password" });
    } else {
      if (req.body.email == data.email && req.body.password == data.password) {
        req.session.user = data.email;
        const user = req.session.user;
        res.render("userDashboard", { user });
      }
    }
  } else {
    res.redirect("/");
  }
};

//session handling for user direct dashboard access
module.exports.getUserDashboard = (req, res) => {
  if (req.session.user) {
    const user = req.session.user;
    res.render("userDashboard", { user });
  }
};

//makiing the value of session null for the purpose of logout
module.exports.getUserLogout = (req, res) => {
  req.session.user = null;
  console.log(req.session);
  res.redirect("/user");
};

//responsing to user sign-up request
module.exports.getUserSignup = async (req, res) => {
  res.render("userSignup");
};

//checking user sign-up details to prevent multiple accounts with same email
module.exports.postUserSignup = async (req, res) => {
  const data = await userCollection.findOne({ email: req.body.email });
  if (data) {
    res.render("userSignup", {
      error: "User with this email Already exists. Try with another email.",
    });
  } else {
    await userCollection.create({
      email: req.body.email,
      fname: req.body.fname,
      lname: req.body.lname,
      password: req.body.password,
    });
    res.redirect("/");
  }
};