const express = require("express");
let books = require("./booksdb.js");
let { isValid, registerUser } = require("./auth_users.js");
const { $error, $send, $response } = require("../serialize/response.js");


const public_users = express.Router();

// Task 6: Register New user – 3 Points
// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // validate username
  if (typeof username !== "string" || username.length < 3)
    return $error(res, "Username must be at least 3 characters long");

  // validate password
  if (typeof password !== "string" || password.length < 6)
    return $error(res, "Password must be at least 6 characters long");

  // check if username is already taken
  if (isValid(username)) return $error(res, "Username already taken");

  // register the user
  registerUser(username, password);

  $send(res,`Welcome aboard, ${username}! You have successfully registered`);
});

// Task 1: Get the book list available in the shop.- 2 Points
// Get the book list available in the shop
public_users.get("/", function (req, res) {
  const list = Object.entries(books).map(([isbn, data]) => ({
    isbn,
    ...data,
  }));

  return $response(res, list);
});

// Task 2: Get the books based on ISBN.- 2 Points
// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });

  return $response(res, book);
});

// Task 3: Get all books by Author. -2 Points
// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const result = [];
  const author = req.params.author.toLowerCase();

  for (const isbn in books) {
    // Case Sensitive
    if (books[isbn].author.toLowerCase() === author) {
      result.push({
        ...books[isbn],
        isbn,
      });
    }
  }

  if (result.length === 0)
    return $error(res, "Not found any book with that author", 404);

  return $response(res, result);
});

// Task 4: Get all books based on Title - 2 Points
// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const search = req.params.title.toLowerCase();
  const result = [];

  for (const isbn in books) {
    // Case Sensitive and Partial
    if (books[isbn].title.toLowerCase().includes(search)) {
      result.push({
        ...books[isbn],
        isbn,
      });
    }
  }

  if (result.length === 0)
    return $error(res, "Not found any book with that title", 404);

  return $response(res, result);
});

//  Task 5: Get book Review. - 2 Points
//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) return $error(res, "Not found any book with that ISBN", 404);

  return $response(res,  book.reviews);
});

module.exports.general = public_users;
