const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");

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

//POST should put before GET methond
//server-side get POST from the form when creating shortURL for LongURL in url_new
app.post("/urls", (req, res) => {
  let strRandom = generateRandomString(6);
  urlDatabase[strRandom] = addHttpPrefix(req.body.longURL);
  res.redirect(`/urls/${strRandom}`);  //redirect to shortURL page
});

const addHttpPrefix = function(url) {
  if (url.substr(0,7) !== "http://") {
    return "http://" + url;
  }
};

//response POST for modify longURL from form in url_show
app.post("/urls/:shortURL/edit", (req, res) => {
  //update shortURL's longURL
  let shortURL = req.params.shortURL;
  urlDatabase[shortURL] = addHttpPrefix(req.body.newURL);
  console.log(shortURL, req.body.newURL);
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
  res.render(`/urls_show`);
});

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  ":u7Po9": "http://www.facebook.com"
};

//rootpage
app.get("/", (req, res) => {
  res.send("Welcome to TinyUrl App!");
});

//show the URLs list
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//show a form to create shortURL for input longURL.
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//url_show: display one shortURL's short/long Link info
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  //console.log(templateVars);
  res.render("urls_show", templateVars);
});

//redirect to display the actual webpage by longURL
app.get("/u/:shortURL", (req, res) => {
  console.log("Now in /u/:shortURL, with req.url:",  req.url);
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL];
  console.log("two urls", shortURL, longURL);
  res.redirect(longURL);
});

//for testing
app.get("/jeremy/:foo/:bar/:baz", (req, res) => {
  console.log("req params", req.params);
  res.json(req.params);
});

app.listen(PORT, () => {
  console.log(`TinyURL app listening on port ${PORT}!`);
});
