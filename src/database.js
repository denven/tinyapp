//Initialized users database
const usersDatabase = {
  "user01": {
    id: "user01",
    email: "user01@example.com",
    password: "$2b$10$FPGcRgvRorMgYV3PeDtkFe0w1l2QM6A8hkX7QM3UnNMSXuofm.K9u"
  },
  "user02": {
    id: "user02",
    email: "user02@example.com",
    password: "$2b$10$PHw5SbT51mV20WuhHneQnectDs91YOs8gMmg0yPzHhefFqfcQY/N6"
  },
  "tester": {
    id: "tester",
    email: "tester@example.com",
    password: "$2b$10$1hfLq1VLOzvjhI.C50DFCuHtp.6rI4bcxWgVT4fB4mETuNS9cfDMK"
  }
};

//Initialized shortURL database
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "user01", date: "10/14/2019", visits: 0, visitedIDs: [] },
  i3BoGr: { longURL: "https://www.google.ca", userID: "user01", date: "10/26/2019", visits: 8, visitedIDs:["user01"] },
  mRo8p6: { longURL: "https://nodejs.org", userID: "user01", date: "10/31/2019", visits: 2, visitedIDs: ["user01"] },
  c8oYxL: { longURL: "https://www.facebook.com", userID: "user02", date: "10/21/2019", visits: 0, visitedIDs:[] },
  a7p3Ry: { longURL: "https://www.yahoo.com", userID: "tester", date: "10/25/2019", visits: 15, visitedIDs:["tester"] },
  uTxe9s: { longURL: "https://www.github.com", userID: "tester", date: "10/31/2019", visits: 3,visitedIDs:["tester"] },
};

module.exports = {
  usersDatabase,
  urlDatabase
};