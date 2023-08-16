const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    UserId: { type: Number},
    UserName: { type: String},
    Password: { type: String},
    FullName: { type: String},
   
});


const Users = mongoose.model("Users", userSchema);

module.exports = Users;