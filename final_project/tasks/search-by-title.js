/**
 * Task 13: Search by Title - 2 Points
 */

const axios = require("axios");

const title = "The Divine";
const url = `http://localhost:5000/title/${encodeURIComponent(title)}`;

async function getBooksByTitle() {
  const response = await axios.get(url);
  const books = response.data;

  for (const book of books) {
    console.log(
      `ISBN: ${book.isbn}, Title: ${book.title}, Author: ${book.author}`
    );
  }
}

getBooksByTitle();
