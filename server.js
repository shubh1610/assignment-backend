const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser')
const axios =require('axios');
require("dotenv").config();

const app = express();
app.use(cors({origin:true,credentials:true}));


const  queryString =require('querystring');
const jwt =require( 'jsonwebtoken');
const cookieParser =require( 'cookie-parser');
app.use(cookieParser());
app.use(cookieParser("secret"));


var corsOptions = {
  origin: "http://localhost:8081"
};

const config = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    redirectUrl: process.env.REDIRECT_URL,
    clientUrl: process.env.CLIENT_URL,
    tokenSecret: process.env.TOKEN_SECRET,
    tokenExpiration: 300000,
  };

  const authParams = queryString.stringify({
    client_id: config.clientId,
    redirect_uri: config.redirectUrl,
    response_type: 'code',
    scope: 'openid profile email',
    access_type: 'offline',  
    state: 'standard_oauth',
    prompt: 'consent',
  });
  const getTokenParams = (code) => queryString.stringify({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    grant_type: 'authorization_code',
    redirect_uri: config.redirectUrl,
  });

const { MongoClient } = require('mongodb');

const mongoose = require("mongoose");

const uri = "mongodb+srv://Shubham:xYsbUfBSVxlWg9sw@cluster0.uu8tplc.mongodb.net/blog_db";

mongoose.connect(uri,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
        console.log("Connected to MongoDB");
    }) 
    .catch((err) => {
        console.error("Error connecting to MongoDB", err);
    });

function getGoogleAuthURL() {
  const rootUrl = config.authUrl;
  const options = {
     scope: ["https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"].join(" "),
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    redirect_uri:config.redirectUrl,
    client_id:config.clientId
  }
  return `${rootUrl}?${queryString.stringify(options)}`;
}

app.get('/auth/google/url', (req, res) => {
    return res.send(getGoogleAuthURL());
});
app.get('/auth/token', async (req, res) => {
    const { code } = req.query;
    if (!code) return res. status(400).json({ message: 'Authorization code must be provided' });
    try {
      // Get all parameters needed to hit authorization server
      const tokenParam = getTokenParams(code);
      // Exchange authorization code for access token (id token is returned here too)
       const { data: { id_token} } = await axios.post(`${config.tokenUrl}?${tokenParam}`)
      if (!id_token) return res.status(400).json({ message: 'Auth error' });
      //Get user info from id token
      const { email, name, id } = jwt.decode(id_token);
      const user = { name, email,id };
      //Sign a new token
      const token = jwt.sign({ user }, config.tokenSecret, { expiresIn: config.tokenExpiration });
      // Set cookies for user
      res.cookie('token', token, { maxAge: config.tokenExpiration, httpOnly: true })
      //You can choose to store user in a DB instead
      res.send(token);
    } catch (err) {
      res.status(500).json({ message: err.message || 'Server error' });
    }
  });

  app.post('/auth/logged_in', (req, res) => {
    try {
      // Get token from cookie
      console.log(req.body);
      const token = req.cookies.token;
      if (!token) {return res.json({ loggedIn: false })};
      const { user } = jwt.verify(token, config.tokenSecret);
      const newToken = jwt.sign({ user }, config.tokenSecret, { expiresIn: config.tokenExpiration });
      // Reset token in cookie
      res.cookie('token', newToken, { maxAge: config.tokenExpiration, httpOnly: true,  })
      res.json({ loggedIn: true, user });
    } catch (err) {
        console.log(err,"errr");
      res.json({ loggedIn: false });
    }
  });

  app.post("/auth/logout", (_, res) => {
    // clear cookie
    res.clearCookie('token').json({ message: 'Logged out' });
    res.json({ loggedIn: false });
  });

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }))



app.use("/user", require('./routes/user-routes'));
app.use("/", require('./routes/blog-routes'));
app.use("/comment", require('./routes/comment-routes'));
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});