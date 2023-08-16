const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    BlogId: { type: String},
    Comment: {type : String},
    Author: {type:String},
    CommentDate: {type: Date},
    AuthorName:{type:String}
});



const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;