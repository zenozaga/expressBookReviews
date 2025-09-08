const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");

const { jwt_secret } = require("../config/auth.js");
const { $error, $send } = require("../serialize/response.js");

const regd_users = express.Router();

let users = [];

// use like db index to check existing usernames directly
let usernames = new Set();

//////////////////////////////
/// Helper functions
//////////////////////////////

// check if existing user
const isValid = (uname) => usernames.has(uname);

// find user by username
const byUserName = (uname) => users.find(({ username }) => username === uname);

// authenticate user login
const authenticatedUser = (uname, pass) => {
  if (!isValid(uname)) return false;

  const user = byUserName(uname);
  return user && user.password === pass;
};

// register a new user
const registerUser = (username, password) => {
  users.push({ username, password });

  // adding  username to set
  // to check existing usernames directly
  usernames.add(username);
};

//////////////////////////////
/// Routes
//////////////////////////////

// Task 7: Login as a Registered user - 3 Points
//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // if user is not registered
  if (!authenticatedUser(username, password))
    return $error(res, "Invalid username or password");

  // generate a JWT token
  const token = jwt.sign({ username }, jwt_secret, { expiresIn: "1h" });

  // store the token in session
  req.session.token = token;

  req.session.save((err) => {
    // if no error, respond with success
    if (err) return $error(res, "An error occurred while trying to log in");

    // error trying to save session
    return $send(res, `User successfully logged in, ${username}`);
  });
});

// Task 8: Add/Modify a book review. - 2 Points
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;
  const review = req.body.review;
  const book = books[isbn];

  // if book not found
  if (!book) return $error(res, "Book not found", 404);

  const action = book.reviews[username] ? "updated" : "added";
  book.reviews[username] = review;

  $send(res, `Your review for “${book.title}” was ${action}: ${review}`);
});

// Task 9: Delete book review added by that particular user - 2 Points
// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;
  const book = books[isbn];

  // if book not found
  if (!book) return $error(res, "Book not found", 404);

  const review = book.reviews[username];
  if (review === undefined) return $error(res, "Review not found", 404);

  // delete review
  delete book.reviews[username];

  $send(res, `Your review '${review}' for “${book.title}” was deleted.`);
});

module.exports.users = users;
module.exports.isValid = isValid;
module.exports.byUserName = byUserName;
module.exports.authenticated = regd_users;
module.exports.registerUser = registerUser;
