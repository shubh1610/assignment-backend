const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blog-controller");

router.post("/addBlog",blogController.addBlog);
router.get("/getblogs",blogController.getBlogs);
router.get("/getblogsbyid",blogController.getBlogsById);

module.exports = router;