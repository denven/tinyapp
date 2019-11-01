
const usersDatabase = {
  "user01": {
    id: "user01",
    email: "user@example.com",
    password: "$2b$10$PHw5SbT51mV20WuhHneQnectDs91YOs8gMmg0yPzHhefFqfcQY/N6"
  },
  "tester": {
    id: "tester",
    email: "user2@example.com",
    password: "$2b$10$1hfLq1VLOzvjhI.C50DFCuHtp.6rI4bcxWgVT4fB4mETuNS9cfDMK"
  }
};

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW", date: "10/14/2019", visits: 0 },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW", date: "10/26/2019", visits: 0 },
  mRo8p6: { longURL: "https://nodejs.org", userID: "tester", date: "10/31/2019", visits: 2 },
  c8oYxL: { longURL: "https://www.facebook.com", userID: "tester", date: "10/21/2019", visits: 0 },
  a7p3Ry: { longURL: "https://www.yahoo.com", userID: "tester", date: "10/25/2019", visits: 15 },
  uTxe9s: { longURL: "https://www.github.com", userID: "tester", date: "10/31/2019", visits: 3 },
};

module.exports = {
  usersDatabase,
  urlDatabase
};