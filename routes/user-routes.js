const express = require("express");
const router = express.Router();
const userController = require("../controllers/user-controller");

router.get("/google/url", userController.authUrl);
router.get("/token", userController.authToken);
router.post("/logged_in", userController.authLogin);
router.post("/logout", userController.authLogin);

module.exports = router;
