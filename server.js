const fs = require('fs');
const path = require('path');

const express = require('express');
const PORT = process.env.PORT || 3001;

const app = express();
const { notes } = require('./Develop/db/db.json');
const { networkInterfaces } = require('os');

app.use(express.static('develop/public'));

//parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
//parse incoming JSON data
app.use(express.json());



function createNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './Develop/db/db.json'),
        JSON.stringify({ notes: notesArray }, null, 2)
    );
    return notes;
}

function validateNote(note) {
    if (!note.title || typeof note.title !== 'string') {
        return false;
    }
    if (!note.text || typeof note.text !== 'string') {
        return false;
    }
    return true;
}

app.get('/api/notes', (req, res) => {
    console.log(notes);
    res.json(notes);});

app.post('/api/notes', (req, res) => {
    req.body.id = notes.length;
    if (!validateNote(req.body)) {
        res.status(400).send('the note is not properly formatted.');
    } else {
        createNewNote(req.body, notes);
        res.json(req.body);
    }
});

app.delete('/api/notes/:id', (req, res) => {
    console.log("line 53")
    const newNotes = notes.filter(note => note.id != req.params.id);
    fs.writeFileSync(
        path.join(__dirname, './Develop/db/db.json'),
        JSON.stringify({ notes: newNotes }, null, 2)
    );
    notes=newNotes;
        console.log(notes);
    res.json(newNotes);
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './develop/public/notes.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './develop/public/index.html'));
});

app.listen(PORT, () => {
    console.log('API server now on port ${PORT}!');
});