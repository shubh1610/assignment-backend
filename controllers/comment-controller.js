const Comments = require("../models/Comments");
var mongo = require("mongodb");

const addComment = async (req, res) => {
  try {
    const { blogComment, author, blogId, authorName } = req.body;

    const newComment = new Comments({
      BlogId: new mongo.ObjectId(blogId),
      Comment: blogComment,
      Author: author,
      AuthorName: authorName,
      CommentDate: new Date(),
    });
    await newComment.save();
    const comments = await Comments.find({ BlogId: blogId })
      .populate("BlogId")
      .exec();
    res.status(200).send(comments);
  } catch (err) {
    res.status(401).json({ message: "Internal Server Error" });
  }
};
const getComments = async (req, res) => {
  const { blogid } = req.params;
  try {
    const comments = await Comments.find({ BlogId: blogid })
      .populate("BlogId")
      .exec();
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: "Internal Error" });
  }
};

exports.addComment = addComment;
exports.getComments = getComments;
