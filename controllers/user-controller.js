const Users = require("../models/Users");
require("dotenv").config();
const axios = require("axios");
const queryString = require("querystring");
const jwt = require("jsonwebtoken");

const config = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenUrl: "https://oauth2.googleapis.com/token",
  redirectUrl: process.env.REDIRECT_URL,
  clientUrl: process.env.CLIENT_URL,
  tokenSecret: process.env.TOKEN_SECRET,
  tokenExpiration: 300000,
};

const getTokenParams = (code) =>
  queryString.stringify({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: config.redirectUrl,
  });

function getGoogleAuthURL() {
  const rootUrl = config.authUrl;
  const options = {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    redirect_uri: config.redirectUrl,
    client_id: config.clientId,
  };
  return `${rootUrl}?${queryString.stringify(options)}`;
}

const authUrl = async (req, res) => {
  return res.send({ data: getGoogleAuthURL() });
};

const authToken = async (req, res) => {
  const { code } = req.query;
  if (!code)
    return res
      .status(400)
      .json({ message: "Authorization code must be provided" });
  try {
    // Get all parameters needed to hit authorization server
    const tokenParam = getTokenParams(code);
    // Exchange authorization code for access token (id token is returned here too)
    const {
      data: { id_token },
    } = await axios.post(`${config.tokenUrl}?${tokenParam}`);
    if (!id_token) return res.status(400).json({ message: "Auth error" });
    //Get user info from id token
    const { email, name, id } = jwt.decode(id_token);
    const user = { name, email, id };
    //Sign a new token
    const token = jwt.sign({ user }, config.tokenSecret, {
      expiresIn: config.tokenExpiration,
    });
    // Set cookies for user
    res.cookie("token", token, {
      maxAge: config.tokenExpiration,
      httpOnly: true,
    });
    //You can choose to store user in a DB instead
    res.send({ data: token });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

const authLogin = async (req, res) => {
  try {
    // Get token from cookie
    const token = req.body.token?.token;
    if (!token) {
      return res.json({ loggedIn: false });
    }
    const { user } = jwt.verify(token, config.tokenSecret);
    const newToken = jwt.sign({ user }, config.tokenSecret, {
      expiresIn: config.tokenExpiration,
    });
    // Reset token in cookie
    res.cookie("token", newToken, {
      maxAge: config.tokenExpiration,
      httpOnly: true,
    });

    let newUser;
    const existingUser = await Users.findOne({ Email: user.email });
    if (!existingUser) {
      newUser = new Users({
        Name: user.name,
        Email: user.email,
      });
      newUser.save();
    } else {
      newUser = {
        Name: user.name,
        Email: user.email,
        _id: existingUser["_id"],
      };
    }

    res.json({ loggedIn: true, newUser });
  } catch (err) {
    res.json({ loggedIn: false });
  }
};

const authLogout = (_, res) => {
  // clear cookie
  res.clearCookie("token").json({ message: "Logged out" });
  res.json({ loggedIn: false });
};

exports.authUrl = authUrl;
exports.authToken = authToken;
exports.authLogin = authLogin;
exports.authLogout = authLogout;
