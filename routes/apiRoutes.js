const router = require('express').Router();
const fs = require('fs');

// Helper method for generating unique ids
const uuid = require('../helpers/uuid');

// GET Route for all notes in the db.json file
router.get('/notes', (req, res) => {
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
  router.post('/notes', (req, res) => {
    
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
                : res.status(200).json(parsedNotes)
          );
          console.info('Successfully updated the notes!')
        }
      })
    }}
  );
  
  // DELETE Route for a specific note_id in the db.json file
  router.delete('/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);
  
        // Stores the ID request parameter
        const requestedID = req.params.id;
  
        // Delete note with a matching ID
        const filteredNotes = parsedNotes.filter(note => note.id !== requestedID);
  
        // Write updated notes back to the file
        fs.writeFile('./db/db.json', JSON.stringify(filteredNotes, null, 4),(writeErr) =>
            writeErr
              ? console.error(writeErr)
              : res.status(200).json(filteredNotes)
        );
        console.info(`Successfully deleted note with ID '${requestedID}'!`)
      }
    })
  });

  module.exports = router;