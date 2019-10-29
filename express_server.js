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
app.post("/urls", (req, res) => {
  let strRandom = generateRandomString(6);
  urlDatabase[strRandom] = req.body.longURL;
  res.redirect(`/urls/${strRandom}`);
});

//POST for Delete shortURL
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`);
});

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  ":u7Po9": "http://www.facebook.com"
};

app.get("/", (req, res) => {
  res.send("Welcome to TinyUrl App!");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL]
  };
  //console.log(templateVars);
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  //console.log("Now in /u/:shortURL, with req.url:",  req.url);
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL];
  //console.log("two urls", shortURL, longURL);
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
