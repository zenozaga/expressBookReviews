const Axios = require("axios");
const express = require("express");
let books = require("./booksdb.js");
let { isValid, registerUser } = require("./auth_users.js");
const { $error, $send, $response } = require("../serialize/response.js");
const { appConfig } = require("../config/app.js");

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

  $send(res, `Welcome aboard, ${username}! You have successfully registered`);
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

////////////////////////////////////////
/// Async Tasks
/// - Use Axios to make HTTP requests
/// - Use Promises and async/await

/// Instructions:
/// 1. Use Async/Await or Promises with
///    Axios in Node.js for all the four
///    methods.
/////////////////////////////////////////

const axios = Axios.create({
  baseURL: `http://localhost:${appConfig.port}`,
});

// Task 10: Get all books – Using async callback function – 2 Points
public_users.get("/books", async function (req, res) {
  try {
    const response = await axios.get("/");
    const books = response.data;

    return $response(res, books);
  } catch (error) {
    return $error(res, error.message || "Something went wrong");
  }
});



// Task 11: Search by ISBN – Using Promises – 2 Points
public_users.get("/book/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  const promise = new Promise((resolve) => {
    // using axios to fetch data from the server
    axios.get(`/isbn/${isbn}`).then((response) => resolve(response.data));
  });

  promise
    .then((book) => $response(res, book))
    .catch((err) => $error(res, err.message || "Something went wrong"));
});



// Task 12: Search by Author – 2 Points
public_users.get("/book/author/:author", async function (req, res) {
  try {
    const author = req.params.author;
    const response = await axios.get(`/author/${encodeURIComponent(author)}`);

    const books = response.data;
    $response(res, books);
  } catch (error) {
    return $error(res, error.message || "Something went wrong");
  }
});



// Task 13: Search by Title – 2 Points
public_users.get("/book/title/:title", async function (req, res) {
  try {
    const title = req.params.title;
    const response = await axios.get(`/title/${encodeURIComponent(title)}`);

    const books = response.data;
    $response(res, books);
  } catch (error) {
    return $error(res, error.message || "Something went wrong");
  }
});

////////////////////////////////
/// Reviews
////////////////////////////////

//  Task 5: Get book Review. - 2 Points
//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) return $error(res, "Not found any book with that ISBN", 404);

  return $response(res, book.reviews);
});

module.exports.general = public_users;
