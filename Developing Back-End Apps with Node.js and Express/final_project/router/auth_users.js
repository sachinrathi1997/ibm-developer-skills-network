const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [ { username: "testuser", password: "testpassword" }
];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;

    // Validate the username and password
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Check if the username is valid
    if (!isValid(username)) {
      return res.status(401).json({ message: "Invalid username" });
    }
  
    // Authenticate the user
    if (!authenticatedUser(username, password)) {
      return res.status(401).json({ message: "Invalid password" });
    }
  
    // Generate a JWT token
    const token = jwt.sign({ username }, 'your_secret_key', { expiresIn: '1h' });
  
    // Return the token in the response
    return res.status(200).json({ message: "Login successful", token });
});

// Middleware to validate JWT token and attach user to request
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.sendStatus(401);
  
    jwt.verify(token, 'your_secret_key', (err, user) => {
      if (err) return res.sendStatus(403);
  
      req.user = user;
      next();
    });
  };
    // Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.user ? req.user.username : null; // Use authenticated user data
  
    console.log(`Review attempt: ISBN=${isbn}, Review=${review}, Username=${username}`);
  
    if (!username) {
      console.log("User not logged in");
      return res.status(403).json({ message: "User not logged in" });
    }
  
    if (!books[isbn]) {
      console.log("Book not found");
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }
  
    books[isbn].reviews[username] = review;
  
    console.log("Review added/modified successfully");
    return res.status(200).json({ message: "Review added/modified successfully" });
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
