const express = require('express');
const path = require('path');
const fs = require('fs');

// Require notes for GET requests
const notes = require('./db/db.json');

// Helper method for generating unique ids
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for homepage (index.html)
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes.html page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET Route for all notes in the db.json file
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object
      const parsedNotes = JSON.parse(data);
      res.status(200).json(parsedNotes)
    }
  })
  console.info(`${req.method} request received to get notes`);
});

// POST Route for adding a note to the db.json file
app.post('/api/notes', (req, res) => {
  
  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid(),
    }

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);

        // Add a new note
        parsedNotes.push(newNote);

        // Write updated notes back to the file
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully updated the notes!')
        );
      }
    })
  }}
);

// // DELETE Route for a specific note_id in the db.json file
// app.delete('/api/notes/:id', (req, res) => {
//   fs.readFile('./db/db.json', 'utf8', (err, data) => {
//     if (err) {
//       console.error(err);
//     } else {
//       // Convert string into JSON object
//       const parsedNotes = JSON.parse(data);

//       // Stores the ID request parameter
//       const requestedID = req.params.id;

//       // Delete note with a matching ID
//       for (let i = 0; i < parsedNotes.length; i++) {
//         if (parsedNotes[i].note_id == requestedID) {
//           parsedNotes.splice(parsedNotes[i])
//         }
//       }

//       // Write updated notes back to the file
//       fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4),(writeErr) =>
//           writeErr
//             ? console.error(writeErr)
//             : console.info(`Successfully deleted note with ID '${requestedID}'!`)
//       );
//     }
//   })
// });

app.listen(PORT, () =>
  console.log(`Note Taker listening at http://localhost:${PORT}`)
);
