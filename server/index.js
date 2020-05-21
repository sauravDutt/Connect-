const express = require('express');
const cors = require('cors');
const monk = require('monk')

const app = express();

const db = monk('localhost/connect');
const messages = db.get('messages');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome! '
    });
});

app.get('/messages', (req, res) => {
    messages
        .find()
        .then(messages => {
            res.json(messages);
        });
});

function isValidMessage(message) {
    return message.name && message.name.toString().trim() != '' &&
    message.content && message.content.toString().trim() != '' 
}

app.post('/messages', (req, res) => {
    if(isValidMessage(req.body)) {
        const msg = {
            name: req.body.name.toString(),
            content: req.body.content.toString(),
            created: new Date()
        };

        messages
        .insert(msg)
        .then(createdMessage => {
            res.json(createdMessage);
        });

    }else {
        res.status(422);
        res.json({
            message:'Hey! Name and Message are required!'
        })
    }
});

app.listen(5000, () => {
    console.log('listening on http://localhost:5000');
});