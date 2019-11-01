
//to avoid an input url without a http:// prefix
const addUrlHttpPrefix = function(url) {
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

const generateUrlCreateDate = function() {
  const date = new Date();
  return date.toLocaleDateString();
};

const getUrlVisitCount = function(shortURL, urlDb) {
  return urlDb[shortURL]["visits"];
};

const getUserIdByShortURL = function(shortUrl, urlDb) {
  return urlDb[shortUrl]["userID"];
};

const updateUrlVisitCount = function(shortURL, urlDb) {
  let visits = Number(urlDb[shortURL]["visits"]);
  urlDb[shortURL]["visits"] = ++visits;
};

const getUserIdByEmail = function(email, userDb) {
  for (let userID in userDb) {
    if (email === userDb[userID].email) {
      return userID;
    }
  }
};

const getUserEmailByID = function(user, userDb) {
  for (const userId in userDb) {
    if (userId === user) {
      return userDb[userId].email;
    }
  }
};

const getUrlsForUser = function(userID, urlDb) {
  let urlsList = {};
  for (let shortURL in urlDb) {
    if (urlDb[shortURL].userID === userID) {
      urlsList[shortURL] = urlDb[shortURL];
    }
  }
  return urlsList;
};

const isUserAlreadyExists = function(email, userDb) {
  for (let userID in userDb) {
    console.log(email, userDb[userID].email);
    if (email === userDb[userID].email) {
      return true;
    }
  }
  return false;
};


module.exports = {
  addUrlHttpPrefix,
  generateRandomString,
  generateUrlCreateDate,
  getUrlsForUser,
  getUrlVisitCount,
  updateUrlVisitCount,
  getUserIdByShortURL,
  getUserIdByEmail,
  getUserEmailByID,
  isUserAlreadyExists
};