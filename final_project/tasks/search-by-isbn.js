/**
 * Task 11: Search by ISBN – Using Promises – 2 Points
 */

const axios = require("axios");

const isbn = "1";
const url = `http://localhost:5000/isbn/${isbn}`;

const promise = new Promise((resolve) => {
  axios
    .get(url)
    .then((response) => resolve(response.data));
});

promise.then((book) => {
  console.log(
    `ISBN: ${isbn}, Title: ${book.title}, Author: ${book.author}`
  );
});
