const routers = require('./src/routers');
const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const PORT = 8080;          // default port 8080

const app = express();

//bodyParser will translate body into req.body
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours in Cookie Options
}));

app.set("view engine", "ejs");

app.use(express.static('public'));  //add a directory for store 404 error files
app.use(`/`, routers);

app.listen(PORT, () => {
  console.log(`TinyURL app listening on port ${PORT}!`);
});
