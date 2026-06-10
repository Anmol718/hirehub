const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const interviewController = require("../controllers/interviewController.js");
const { isLoggedIn } = require("./middleware.js");

router.get("/", isLoggedIn, interviewController.renderInterview);
router.post("/generate", isLoggedIn, wrapAsync(interviewController.generateQuestions));
router.post("/evaluate", isLoggedIn, wrapAsync(interviewController.evaluateAnswers));

module.exports = router;
