const routers = require('./src/routers');

const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');

const app = express();
const PORT = 8080; // default port 8080

//bodyParser will translate body into req.body for forms POST
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours in Cookie Options
}));

app.set("view engine", "ejs");

app.use(`/`, routers);

app.listen(PORT, () => {
  console.log(`TinyURL app listening on port ${PORT}!`);
});
