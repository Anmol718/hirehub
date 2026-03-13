const Joi = require("joi");

module.exports.jobSchema = Joi.object({
  job: Joi.object({
    title: Joi.string().min(3).max(100).required(),
    company: Joi.string().min(2).max(100).required(),
    location: Joi.string().min(2).max(100).required(),
    jobType: Joi.string()
      .valid("Full-Time", "Part-Time", "Internship", "Contract")
      .required(),
    workMode: Joi.string()
      .valid("Remote", "In-Office", "Hybrid", "Onsite")
      .required(),
    experienceLevel: Joi.string().valid("Entry", "Mid", "Senior").required(),
    salary: Joi.number().min(0).optional(),
    description: Joi.string().min(10).required(),
    skills: Joi.string().min(1).required(),
  }).required(),
});

// =========================
// User Signup Schema
// =========================
module.exports.signupSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().label("Username"),
  email: Joi.string()
    .email({ tlds: { allow: false } }) // basic email format
    .required()
    .label("Email"),
  password: Joi.string().min(5).required().label("Password"),
  role: Joi.string().valid("candidate", "employer").required().label("Role"),
});

// =========================
// User Login Schema
// =========================
module.exports.loginSchema = Joi.object({
  username: Joi.string().required().label("Username"),
  password: Joi.string().required().label("Password"),
});

// Application validation schema
module.exports.applicationSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required().label("Full Name"),

  email: Joi.string()
    .email({ tlds: { allow: false } }) // basic email validation
    .required()
    .label("Email"),

  phone: Joi.string()
    .pattern(/^\+?[0-9]{10,15}$/)
    .allow("")
    .label("Phone Number"),

  coverLetterText: Joi.string()
    .max(2000)
    .allow("")
    .optional()
    .label("Cover Letter"),

  linkedIn: Joi.string()
    .uri()
    .allow("") // optional
    .label("LinkedIn URL"),

  portfolio: Joi.string()
    .uri()
    .allow("") // optional
    .label("Portfolio URL"),
});
