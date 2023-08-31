const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  Name: { type: String },
  Email: { type: String },
  blogs: { type: Schema.Types.ObjectId, ref: "Blog" },
});

const Users = mongoose.model("Users", userSchema);

module.exports = Users;
