const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// REGISTER
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    if (isValid(username)) {
        return res.status(409).json({ message: "User already exists" });
    }

    users.push({ username, password });
    return res.status(200).json({ message: "User successfully registered" });
});

// GET ALL BOOKS
public_users.get('/', (req, res) => {
    return res.send(JSON.stringify(books, null, 4));
});

// GET BY ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    return res.send(books[isbn]);
});

// GET BY AUTHOR
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;
    let filtered = {};

    Object.keys(books).forEach(key => {
        if (books[key].author === author) {
            filtered[key] = books[key];
        }
    });

    return res.send(filtered);
});

// GET BY TITLE
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;
    let filtered = {};

    Object.keys(books).forEach(key => {
        if (books[key].title === title) {
            filtered[key] = books[key];
        }
    });

    return res.send(filtered);
});

// GET REVIEW
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    return res.send(books[isbn].reviews);
});

module.exports.general = public_users;
const axios = require('axios');

// Async/Await - Get All Books
public_users.get('/asyncbooks', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/');
        res.send(response.data);
    } catch (err) {
        res.send(err.message);
    }
});

// Promise - Get by ISBN
public_users.get('/promise/isbn/:isbn', (req, res) => {
    new Promise((resolve, reject) => {
        const book = books[req.params.isbn];
        if (book) resolve(book);
        else reject("Book not found");
    })
        .then(data => res.send(data))
        .catch(err => res.send(err));
});
