const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const chatbotController = require("../controllers/chatbot.js");
const { isLoggedIn } = require("./middleware.js");

router.get("/", isLoggedIn, wrapAsync(chatbotController.renderChat));
router.post("/message", isLoggedIn, chatbotController.sendMessage);
router.delete("/history", isLoggedIn, wrapAsync(chatbotController.clearHistory));

module.exports = router;
