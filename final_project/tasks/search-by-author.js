/**
 * Task 12: Search by Author – 2 Points
 */

const axios = require("axios");

const author = "jane austen";
const url = `http://localhost:5000/author/${encodeURIComponent(author)}`;

async function getBooksByAuthor() {
  const response = await axios.get(url);
  const books = response.data;

  for (const book of books) {
    console.log(
      `ISBN: ${book.isbn}, Title: ${book.title}, Author: ${book.author}`
    );
  }
}

getBooksByAuthor();
