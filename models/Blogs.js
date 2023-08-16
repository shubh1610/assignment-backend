const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const blogSchema = new Schema({
    BlogId: { type: Number},
    Title: { type: String},
    Content: { type: String},
    Author: { type: String},
    PublishedDate : { type: Date},
    UserId: { type: String},
});


blogSchema.pre("save", async function (next){
    const blog = this;
    if(blog.BlogId){
        return next();
    }
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;