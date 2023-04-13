const express = require('express');
const routes = require('./routes')

// Require notes for GET requests
const notes = require('./db/db.json');

const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use(routes);

app.listen(PORT, () =>
  console.log(`Note Taker listening at http://localhost:${PORT}`)
);
