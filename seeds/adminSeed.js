// seeds/adminSeed.js
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/user"); // adjust path if needed
const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/hirehub";

mongoose
  .connect(dbUrl)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ email: "admin@hirehub.com" });
    if (existingAdmin) {
      console.log("Admin already exists!");
      return mongoose.connection.close();
    }

    const admin = new User({
      username: "superadmin",
      email: "admin@hirehub.com",
      role: "admin",
    });

    await User.register(admin, "StrongPassword123"); // passport-local-mongoose handles hashing
    console.log("Admin created!");
  } catch (e) {
    console.log(e);
  } finally {
    mongoose.connection.close();
  }
};

seedAdmin();
