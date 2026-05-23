const User = require("../models/user.js");

// ── reCAPTCHA helper ──────────────────────────────────────────────────────────
const verifyRecaptcha = async (token) => {
  const params = new URLSearchParams({
    secret:   process.env.RECAPTCHA_SECRET_KEY,
    response: token,
  });
  const res  = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method:  "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body:    params.toString(),
  });
  const data = await res.json();
  return data.success === true;
};

// Middleware — placed before passport.authenticate on the login route so the
// check runs before credentials are ever verified.
module.exports.checkRecaptcha = async (req, res, next) => {
  const token = req.body["g-recaptcha-response"];
  const redirectTo = req.path.includes("signup") ? "/signup" : "/login";

  if (!token) {
    req.flash("error", "Please complete the reCAPTCHA verification.");
    return res.redirect(redirectTo);
  }

  try {
    const passed = await verifyRecaptcha(token);
    if (!passed) {
      req.flash("error", "Please complete the reCAPTCHA verification.");
      return res.redirect(redirectTo);
    }
    next();
  } catch (err) {
    console.error("reCAPTCHA error:", err);
    req.flash("error", "reCAPTCHA check failed. Please try again.");
    res.redirect(redirectTo);
  }
};

// ── Controllers ───────────────────────────────────────────────────────────────

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
  try {
    let { username, email, password, role } = req.body;
    const newUser = new User({ email, username, role });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
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

  let redirectUrl = res.locals.redirectUrl;

  if (!redirectUrl) {
    if (req.user.role === "admin") {
      redirectUrl = "/admin/dashboard";
    } else if (req.user.role === "employer") {
      redirectUrl = "/employers/dashboard";
    } else {
      redirectUrl = "/home";
    }
  }

  delete req.session.redirectUrl;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You are logged out now!");
    res.redirect("/home");
  });
};
