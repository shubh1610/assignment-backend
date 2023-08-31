const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  BlogId: { type: Schema.Types.ObjectId, ref: "Blog" },
  Comment: { type: String, required: true },
  Author: { type: String, required: true },
  CommentDate: { type: Date },
  AuthorName: { type: String, required: true },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
