const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment-controller");

router.post("/addComment", commentController.addComment);
router.get("/getComments/:blogid", commentController.getComments);

module.exports = router;
