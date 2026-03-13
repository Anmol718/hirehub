if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Job = require("./models/jobs.js");
const path = require("path");
const ExpressError = require("./utils/ExpressError.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const adminRouter = require("./routes/admin.js");

// Routers
const jobsRouter = require("./routes/jobs.js");
const employersRouter = require("./routes/employers.js");
const userRouter = require("./routes/user.js");
const applicationRouter = require("./routes/applications.js");

// MongoDB connection URL

const dbUrl = process.env.ATLASDB_URL;

// Connect to MongoDB
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // views folder
app.engine("ejs", ejsMate); // enable layout support

// Middleware
app.use(express.urlencoded({ extended: true })); // parse form data
app.use(methodOverride("_method")); // override methods using query param
app.use(express.static(path.join(__dirname, "/public"))); // serve static files from /public

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success") || [];
  res.locals.error = req.flash("error") || [];
  res.locals.currUser = req.user;
  next();
});

// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "Delta-student",
//   });
//   let registeredUser = await User.register(fakeUser, "helloWorld");
//   res.send(registeredUser);
// });

// Redirect root to home
app.get("/", (req, res) => res.redirect("/home"));

// Home route - display featured jobs on landing page
app.get("/home", async (req, res) => {
  const featuredJobs = await Job.find({}).limit(3); // get 3 jobs
  res.render("sections/home.ejs", { featuredJobs });
});

// Use modular routers
app.use("/jobs", jobsRouter); // all /jobs routes handled by jobsRouter
app.use("/employers", employersRouter); // all /employers routes handled by employersRouter
app.use("/", userRouter);
app.use("/applications", applicationRouter);
app.use("/admin", adminRouter);

// 404 handler - for any route not matched above
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

// Error handling middleware - catches all errors
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong." } = err;
  res.status(statusCode).render("error.ejs", { message, statusCode });
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is listening to port ${PORT}`);
});
