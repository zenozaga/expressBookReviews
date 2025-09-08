/**
 * Task 10: Get all books – Using async callback function – 2 Points
 */

const axios = require("axios");

const url = `http://localhost:5000/`;

async function getListBooks() {
  const response = await axios.get(url);
  const books = response.data;

  for (const book of books) {
    console.log(
      `ISBN: ${book.isbn}, Title: ${book.title}, Author: ${book.author}`
    );
  }
}

getListBooks();
