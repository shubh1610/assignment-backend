const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const blogSchema = new Schema({
  Title: { type: String, required: true },
  Content: { type: String, required: true },
  PublishedDate: { type: Date },
  comments: { type: Schema.Types.ObjectId, ref: "Comment" },
  userId: { type: Schema.Types.ObjectId, ref: "Users" },
});

blogSchema.pre("save", async function (next) {
  const blog = this;
  if (blog.BlogId) {
    return next();
  }
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
