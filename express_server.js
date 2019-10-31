const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

const users = {
  "aJ48lW": {
    id: "aJ48lW",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "uTestW": {
    id: "uTestW",
    email: "user2@example.com",
    password: "dish"
  }
};

// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com",
//   ":u7Po9": "http://www.facebook.com"
// };

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
  c8oYxL: { longURL: "https://www.google.ca", userID: "uTestW" }
};

const getUrlsForUser = function(userID) {
  let urlsList = {};
  for (let shortURL in urlDatabase) {
    console.log("debug: ", shortURL, userID, urlDatabase[shortURL].userID);
    if (urlDatabase[shortURL].userID === userID) {
      urlsList[shortURL] = urlDatabase[shortURL].longURL;
    }
  }
  console.log("urlDatabase ", urlDatabase);
  console.log("userId urlList: ", userID, urlsList);
  return urlsList;
};

const isUserAlreadyExists = function(email) {
  for (let userID in users) {
    console.log(email, users[userID].email);
    if (email === users[userID].email) {
      return true;
    }
  }
  return false;
};

const getUserIDFromUserTable = function(email) {
  for (let userID in users) {
    if (email === users[userID].email) {
      return userID;
    }
  }
};

const getUserEmailByID = function(user) {
  for (const userId in users) {
    if (userId === user) {
      return users[userId].email;
    }
  }
};

//to avoid an input url doesn't contail http:// prefix
const addHttpPrefix = function(url) {
  if ((url.substr(0, 4) !== "http")) {
    return "https://" + url;
  } else {
    return url;
  }
};

//generate randomly of len chars' string
const generateRandomString = function(len) {
  let retStrRandom = "";
  const strTemplate = "aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ0123456789";
  for (let i = 0; i < len; i++) {
    let index = Math.ceil(Math.random() * 100000000) % strTemplate.length;
    retStrRandom += strTemplate.charAt(index);
  }
  return retStrRandom;
};

//bodyParser will translate body into req.body for forms POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.post("/register", (req, res) => {
  const {email, password} = req.body;
  console.log("/register: ", email, password);
  if ((!email) || (!password)) {
    res.statusCode = 400;
    res.send();
  }

  if (isUserAlreadyExists(email)) {
    res.statusCode = 400;
    res.send();
    return;
  }

  const newUserID = generateRandomString(6);
  users[newUserID] = { id: newUserID, email: req.body.email, password: req.body.password };
  console.log("/registr: ", users[newUserID]);
  console.log("Set UserID in cookies: ", newUserID);
  res.cookie('user_id', newUserID);
  res.redirect(`/urls`);
});

//add code for cookies impelments: process POST from user login form
app.post("/login", (req, res) => {
  if (isUserAlreadyExists(req.body.email)) {
    const userID = getUserIDFromUserTable(req.body.email);
    console.log(req.body.email, req.body.password, userID);
    if (req.body.password === users[userID].password) {
      res.cookie('user_id', userID);
      res.redirect(`/urls`);  //redirect to index page
    } else {
      res.statusCode = 403;
      res.send();
    }
  } else {
    res.statusCode = 403;
    res.send();
  }
});

//process logout POST
app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect(`/urls`);  //redirect to index page
});

//POST should put before GET methond
//server-side get POST from the form in url_new when submitting to create a new shortURL
app.post("/urls", (req, res) => {
  let strRandom = generateRandomString(6);
  urlDatabase[strRandom] = { longURL: addHttpPrefix(req.body.longURL), userID: req.cookies.user_id };
  res.redirect(`/urls/${strRandom}`);  //redirect to shortURL page
});

//response POST for modify longURL from form in url_show
app.post("/urls/:shortURL/edit", (req, res) => {
  //update shortURL's longURL
  let shortURL = req.params.shortURL;
  //update information in database as modification is done
  urlDatabase[shortURL] = { longURL: addHttpPrefix(req.body.newURL), userID: req.cookies.user_id };
  console.log("edit url: ", urlDatabase);
  res.redirect(`/urls/${shortURL}`);
});

//POST for Delete Button in url_index
app.post("/urls/:shortURL/delete", (req, res) => {
  console.log("get delete post for shortURL", req.params.shortURL);
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`);
});

//GET process from Edit button in url_index
app.get("/urls/:shortURL/edit", (req, res) => {
  //let templateVars = { username: req.cookies.username };
  //let templateVars = users[req.cookies.user_id];
  let templateVars = {email: getUserEmailByID(req.cookies.user_id)};
  res.render(`/urls_show`, templateVars);
});

app.set("view engine", "ejs");

//rootpage
app.get("/", (req, res) => {
  res.send("Welcome to TinyUrl App!");
});

app.get("/login", (req, res) => {
  //let templateVars = users[req.cookies.user_id];
  //console.log(templateVars);
  let templateVars = {email: getUserEmailByID(req.cookies.user_id)};
  res.render("urls_login", templateVars);
});

app.get("/register", (req, res) => {
  //let templateVars = users[req.cookies.user_id];
  let templateVars = {email: getUserEmailByID(req.cookies.user_id)};
  res.render("urls_register", templateVars);
});

//show the URLs list
app.get("/urls", (req, res) => {
  let loginUser = users[req.cookies.user_id];
  let userEmail = getUserEmailByID(req.cookies.user_id);
  console.log("/urls: email and ID ", userEmail, req.cookies.user_id);
  //let templateVars = { urls: urlDatabase, email: users[req.cookies.user_id]['email'] };
  let templateVars = { urls: getUrlsForUser(req.cookies.user_id), email: userEmail };
  res.render("urls_index", templateVars);
});

//show a form to create shortURL for input longURL.
app.get("/urls/new", (req, res) => {
  console.log(req.cookies.user_id);
  //if(req.cookies.user_id ==)
  let templateVars = {email: getUserEmailByID(req.cookies.user_id)};
  res.render("urls_new", templateVars);
});

//url_show: display one shortURL's short/long Link info
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    "shortURL": req.params.shortURL,
    "longURL": urlDatabase[req.params.shortURL]["longURL"],
    "email": getUserEmailByID(req.cookies.user_id)
  };
  console.log(urlDatabase);
  console.log(templateVars);
  res.render("urls_show", templateVars);
});

//redirect to display the actual webpage by longURL
app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

//for route pattern test
app.get("/jeremy/:foo/:bar/:baz", (req, res) => {
  console.log("req params", req.params);
  res.json(req.params);
});

app.listen(PORT, () => {
  console.log(`TinyURL app listening on port ${PORT}!`);
});
