const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors({ origin: true, credentials: true }));

const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(cookieParser("secret"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const mongoose = require("mongoose");

const uri = process.env.MONGO_DB_CONNECTION_STRING;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

function addValidComment(req, res, next) {
  if (req.body.blogComment === "" || req.body.blogComment === null) {
    return res.status(400).send("Request body has empty or null value");
  }
  next();
}

app.use("/auth", require("./routes/user-routes"));
app.use("/", require("./routes/blog-routes"));
app.use("/comment", addValidComment, require("./routes/comment-routes"));
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
