const express = require('express');
const routers = express.Router();

const helper = require("./helpers");
const errMsg = require("./constants");
const users = require("./database").usersDatabase;
const urlDatabase = require("./database").urlDatabase;
const bcrypt = require('bcrypt');

routers.use((req, res, next) => {
  console.log(`Enable ruouting Successfuly`, Date.now());
  next();
});

//process the POST when user submit a registration form
routers.post("/register", (req, res) => {
  const {email, password, password2 } = req.body;

  //email already registered
  if (helper.isUserAlreadyExists(email, users)) {
    res.render(`urls_register`, { email: "", msg: errMsg.EML_ARD_USED });
    return;
  }

  //email is valid, check the password
  if (password !== password2) {
    res.render(`urls_register`, { email: "", msg: errMsg.PWD_NOT_MATCH});
    return;
  }

  //create user account and save user info into database
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUserID = helper.generateRandomString(6);
  users[newUserID] = { id: newUserID, email: req.body.email, password: hashedPassword };
  req.session.user_id = newUserID;   //save user session
  res.redirect(`/urls`);
  return;
});

//process POST from user login form
routers.post("/login", (req, res) => {
  if (helper.isUserAlreadyExists(req.body.email, users)) {
    const userId = helper.getUserIdByEmail(req.body.email, users);
    let hashedPassword = users[userId].password;  //user hashed password stored in user database
    let isPwdRight = bcrypt.compareSync(req.body.password, hashedPassword);

    if (isPwdRight) {
      req.session.user_id = userId;
      res.redirect(`/urls`);  //redirect to index page
    } else {
      res.render(`urls_login`, { email: "", msg: errMsg.PWD_NOT_RIGHT });
    }
  } else {
    //the user is not registered in users' database
    res.render(`urls_login`, { email: "", msg: errMsg.USR_NOT_EXIST });
  }
});

//process logout POST
routers.post("/logout", (req, res) => {
  //res.clearCookie('user_id');
  req.session.user_id = '';
  res.redirect(`/urls`);
});

//process POST from the form in url_new when creating a new shortURL
routers.post("/urls", (req, res) => {
  let strRandom = helper.generateRandomString(6);
  let strCreateDate = helper.generateUrlCreateDate();
  urlDatabase[strRandom] = {
    "longURL": helper.addUrlHttpPrefix(req.body.longURL),
    "userID": req.session.user_id,
    "date": strCreateDate,
    "visits": "0"
  };
  res.redirect(`/urls/${strRandom}`);  //redirect to shortURL page
});

//response POST for modifying longURL from the form in url_show
routers.post("/urls/:shortURL/edit", (req, res) => {
  let shortURL = req.params.shortURL;
  let userID = helper.getUserIdByShortURL(shortURL, urlDatabase);
  if (userID === req.session.user_id) {
    //update information in database as modification is done
    urlDatabase[shortURL]["longURL"] = helper.addUrlHttpPrefix(req.body.newURL);
  }
  res.redirect(`/urls/${shortURL}`);
});

//POST for Delete Button in url_index
routers.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`);
});

//GET process from Edit button in url_index
routers.get("/urls/:shortURL/edit", (req, res) => {
  let templateVars = {email: helper.getUserEmailByID(req.session.user_id, users)};
  res.render(`/urls_show`, templateVars);
});

//home page redirection
routers.get("/", (req, res) => {
  if (!req.session.user_id) {
    res.redirect(`/login`);
  } else {
    res.redirect(`/urls`);
  }
});

routers.get("/login", (req, res) => {
  let userEmail = helper.getUserEmailByID(req.session.user_id, users);
  let templateVars = {"email": userEmail, "msg": ""};
  res.render(`urls_login`, templateVars);
});

routers.get("/register", (req, res) => {
  let userEmail = helper.getUserEmailByID(req.session.user_id, users);
  let templateVars = {"email": userEmail, "msg": ""};
  res.render(`urls_register`, templateVars);
});

//show the URLs list
routers.get("/urls", (req, res) => {
  let userEmail = helper.getUserEmailByID(req.session.user_id, users);
  let userUrls = helper.getUrlsForUser(req.session.user_id, urlDatabase);
  let templateVars = { "urls": userUrls, "email": userEmail, "msg": "" };
  if (!req.session.user_id) {
    templateVars["msg"] = errMsg.USR_NOT_LOGIN;
  }
  res.render("urls_index", templateVars);
});

//show a form to create shortURL for input longURL.
routers.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    res.redirect("/login");
  }
  let templateVars = {email: helper.getUserEmailByID(req.session.user_id, users)};
  res.render("urls_new", templateVars);
});

//url_show render: display one shortURL's short/long Link info according to login status
routers.get("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let userEmail = helper.getUserEmailByID(req.session.user_id, users);
  let templateVars = { "shortURL": shortURL, "longURL": "", "email": userEmail, "msg": "" };

  if (shortURL in urlDatabase) {
    if (!req.session.user_id) {
      templateVars["msg"] = errMsg.USR_NOT_LOGIN;
    } else {
      //user already logined in
      if (req.session.user_id !== helper.getUserIdByShortURL(shortURL, urlDatabase)) {
        //don't show longURL info when requesting to other user's url
        templateVars["longURL"] = "";
        templateVars["msg"] = errMsg.SHTURL_NO_PERMIT;
      } else {
        //authorized right user
        templateVars["longURL"] = urlDatabase[req.params.shortURL]["longURL"];
      }
    }
  } else {
    //url not in the database
    templateVars["msg"] = errMsg.SHTURL_NOT_EXIST;
  }

  res.render("urls_show", templateVars);
});

//redirect to display the actual webpage by longURL
routers.get("/u/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let templateVars = { "shortURL": shortURL, "longURL": "", "email": "", "msg": "" };
  
  if (shortURL in urlDatabase) {
    //authorized user is allowed to redirect
    helper.updateUrlVisitCount(shortURL, urlDatabase);
    res.redirect(urlDatabase[shortURL].longURL);
  } else {
    //not existed url request
    templateVars["email"] = helper.getUserEmailByID(req.session.user_id, users);
    templateVars["msg"] = errMsg.SHTURL_NOT_EXIST;
    res.render(`urls_show`, templateVars);
  }
});

//process un-supported page access
routers.get('*',function(req,res) {
  res.redirect('404.html');
});


module.exports = routers;
