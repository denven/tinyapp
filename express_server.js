const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');

const users = {
  "aJ48lW": {
    id: "aJ48lW",
    email: "user@example.com",
    password: "$2b$10$PHw5SbT51mV20WuhHneQnectDs91YOs8gMmg0yPzHhefFqfcQY/N6"
  },
  "uTestW": {
    id: "uTestW",
    email: "user2@example.com",
    password: "$2b$10$1hfLq1VLOzvjhI.C50DFCuHtp.6rI4bcxWgVT4fB4mETuNS9cfDMK"
  }
};

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW", date: "10/14/2019", visits: 0 },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW", date: "10/26/2019", visits: 0  },
  c8oYxL: { longURL: "https://www.google.ca", userID: "uTestW", date: "10/31/2019", visits: 0  }
};

const generateUrlCreateDate = function() {
  //const timestamp = Date.parse(new Date()) / 1000;
  const date = new Date();
  return date.toLocaleDateString();
};

const getUrlCreateDate = function(shortURL) {
  return urlDatabase[shortURL]["date"];
};

const getUrlVistCount = function(shortURL) {
  return urlDatabase[shortURL]["visits"];
};

const updateUrlVistCount = function(shortURL) {
  console.log("-----------------------------\n", shortURL, urlDatabase);
  let visits = Number(urlDatabase[shortURL]["visits"]);
  console.log("visist-------------------", visits);
  urlDatabase[shortURL]["visits"] = ++visits;
  console.log(urlDatabase[shortURL]["visits"], visits);
};

const getUserIDByShortURL = function(shortUrl) {
  return urlDatabase[shortUrl]["userID"];
};

const getUrlsForUser = function(userID) {
  let urlsList = {};
  for (let shortURL in urlDatabase) {
    console.log("debug: ", shortURL, userID, urlDatabase[shortURL].userID);
    if (urlDatabase[shortURL].userID === userID) {
      urlsList[shortURL] = urlDatabase[shortURL];
    }
  }
  console.log("urlDatabase ", urlDatabase);
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

const getUserIDByEmail = function(email) {
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

//to avoid an input url without a http:// prefix
const addHttpPrefix = function(url) {
  if ((url.substr(0, 4) !== "http")) {
    return "http://" + url;
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
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.post("/register", (req, res) => {
  const {email, password, password2 } = req.body;

  //email already registered
  if (isUserAlreadyExists(email)) {
    res.render(`urls_register`, { email: "", msg: "Error: email has aready been used, try another one."});
    return;
  }

  //email is valid, check the password
  if (password !== password2) {
    res.render(`urls_register`, { email: "", msg: "Error: password not match."});
    return;
  }

  //create user account and save user info into database
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUserID = generateRandomString(6);
  users[newUserID] = { id: newUserID, email: req.body.email, password: hashedPassword };
  req.session.user_id = newUserID;   //save user session
  res.redirect(`/urls`);
  return;
});

//add code for cookies impelments: process POST from user login form
app.post("/login", (req, res) => {
  if (isUserAlreadyExists(req.body.email)) {
    const userID = getUserIDByEmail(req.body.email);
    let hashedPassword = users[userID].password;  //user hashed password in user database
    let isPwdRight = bcrypt.compareSync(req.body.password, hashedPassword); // returns true

    console.log("/login: ", req.body.password, userID, hashedPassword);
    if (isPwdRight) {
      req.session.user_id = userID;
      res.redirect(`/urls`);  //redirect to index page
    } else {
      res.render(`urls_login`, { email: "", msg: "Error: Bad password, try it again."});
    }
  } else {
    res.render(`urls_login`, { email: "", msg: "Error: Account not exsits in user Database."});
  }
});

//process logout POST
app.post("/logout", (req, res) => {
  //res.clearCookie('user_id');
  req.session.user_id = '';
  res.redirect(`/urls`);  //redirect to index page
});


//POST should put before GET methond
//server-side get POST from the form in url_new when submitting to create a new shortURL
app.post("/urls", (req, res) => {
  let strRandom = generateRandomString(6);
  let strCreateDate = generateUrlCreateDate();
  urlDatabase[strRandom] = { "longURL": addHttpPrefix(req.body.longURL),
    "userID": req.session.user_id, "date": strCreateDate, "visits": "0" };
  //console.log(urlDatabase, strCreateDate);
  res.redirect(`/urls/${strRandom}`);  //redirect to shortURL page
});

//response POST for modify longURL from form in url_show
app.post("/urls/:shortURL/edit", (req, res) => {
  //update shortURL's longURL
  let shortURL = req.params.shortURL;
  //update information in database as modification is done
  let userID = getUserIDByShortURL(shortURL);
  if (userID === req.session.user_id) {
    urlDatabase[shortURL]["longURL"] = addHttpPrefix(req.body.newURL);
    console.log("update----------------------", urlDatabase);
  }
  console.log("edit url==============: ", urlDatabase);
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
  let templateVars = {email: getUserEmailByID(req.session.user_id)};
  res.render(`/urls_show`, templateVars);
});

app.set("view engine", "ejs");

//rootpage
app.get("/", (req, res) => {
  if (!req.session.user_id) {
    res.redirect(`/login`);
  } else {
    res.redirect(`/urls`);
  }
});

app.get("/login", (req, res) => {
  let templateVars = {email: getUserEmailByID(req.session.user_id), msg: ""};
  res.render(`urls_login`, templateVars);
});

app.get("/register", (req, res) => {
  let templateVars = {email: getUserEmailByID(req.session.user_id), msg: "Error: password not match."};
  res.render(`urls_register`, templateVars);
});

//show the URLs list
app.get("/urls", (req, res) => {
  let loginUser = users[req.session.user_id];
  let userEmail = getUserEmailByID(req.session.user_id);
  console.log("/urls: email and ID ", userEmail, req.session.user_id);
  let templateVars = { "urls": getUrlsForUser(req.session.user_id), "email": userEmail };
  res.render("urls_index", templateVars);
});

//show a form to create shortURL for input longURL.
app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/login");
  }
  let templateVars = {email: getUserEmailByID(req.session.user_id)};
  res.render("urls_new", templateVars);
});

//url_show: display one shortURL's short/long Link info
app.get("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let templateVars = { "shortURL": shortURL, "longURL": "", "email": "", "msg": "" };
  if (shortURL in urlDatabase) {
    console.log("session", req.session.user_id);
    if (!req.session.user_id) {
      templateVars["msg"] = `You have not logined in, cannot access this URL!`;
    } else {
      //logined in
      templateVars["email"] = getUserEmailByID(req.session.user_id); //logined in user
      console.log("/urls/:shortURL", req.session.user_id, getUserIDByShortURL(shortURL), shortURL);
      if (req.session.user_id !== getUserIDByShortURL(shortURL)) {
        //requst for other userid's url, not allowed
        templateVars["longURL"] = ""; //don't show the long url info
        templateVars["msg"] = "The shortURL does not belong to you!";
      } else {
        templateVars["longURL"] = urlDatabase[req.params.shortURL]["longURL"];
      }
    }
  } else {
    templateVars["msg"] = "The shortURL does not exist, no Long URL matched!";
  }
  res.render("urls_show", templateVars);
});

//redirect to display the actual webpage by longURL
app.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let templateVars = { "shortURL": shortURL, "longURL": "", "email": "", "msg": "" };
  
  if (shortURL in urlDatabase) {
    templateVars["email"] = getUserEmailByID(req.session.user_id); //logined in user
    console.log("===================");
    console.log(req.session.user_id, getUserEmailByID(req.session.user_id), getUserIDByShortURL(shortURL));
    if (req.session.user_id !== getUserIDByShortURL(shortURL)) {
      templateVars["longURL"] = ""; //don't show the long url info
      templateVars["msg"] = "The shortURL does not belong to you, cannot redirect!";
      res.render(`urls_show`, templateVars);
    } else {
      updateUrlVistCount(shortURL);
      res.redirect(urlDatabase[shortURL].longURL);
    }
  } else {
    templateVars = {
      "email": getUserEmailByID(req.session.user_id),
      "msg": "The shortURL does not exist, no Long URL matched!"
    };
    res.render(`urls_show`, templateVars);
  }
});

//for route pattern test
app.get("/jeremy/:foo/:bar/:baz", (req, res) => {
  console.log("req params", req.params);
  res.json(req.params);
});

app.listen(PORT, () => {
  console.log(`TinyURL app listening on port ${PORT}!`);
});
