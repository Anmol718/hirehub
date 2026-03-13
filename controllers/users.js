const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
  try {
    let { username, email, password, role } = req.body; // get role from form
    const newUser = new User({ email, username, role }); // save role
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to HireHub!");
      res.redirect("/home");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to HireHub!");

  // Use saved redirect URL if it exists
  let redirectUrl = res.locals.redirectUrl;

  if (!redirectUrl) {
    // Role-based redirect
    if (req.user.role === "admin") {
      redirectUrl = "/admin/dashboard";
    } else if (req.user.role === "employer") {
      redirectUrl = "/employers/dashboard"; // adjust if you have employer dashboard
    } else {
      redirectUrl = "/home"; // regular user
    }
  }

  delete req.session.redirectUrl; // clean up the session
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out now!");
    res.redirect("/home");
  });
};
