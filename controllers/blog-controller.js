const Blogs = require("../models/Blogs");
const Users = require("../models/Users");
var mongo = require("mongodb");

const addBlog = async (req, res) => {
  try {
    const { title, content, userId } = req.body;
    const newBlog = new Blogs({
      Title: title,
      Content: content,
      PublishedDate: new Date(),
      userId: new mongo.ObjectId(userId),
    });

    await newBlog.save();

    res.status(200).json({
      message: "Blog created successfully",
    });
  } catch (err) {
    console.error("Error in creating Blog", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blogs.find();
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ error: "Internal Error" });
  }
};

const getBlogsById = async (req, res) => {
  const { user } = req.params;
  try {
    const blogs = await Blogs.find({ userId: user }).populate("userId").exec();
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ error: "Internal Error" });
  }
};

exports.addBlog = addBlog;
exports.getBlogs = getBlogs;
exports.getBlogsById = getBlogsById;
