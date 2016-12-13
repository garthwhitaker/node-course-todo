const express = require('express');
const bodyParser = require('body-parser');

var mongoose = require('./db/mongoose');
var {User} = require('./models/User');
var {Todo} = require('./models/Todo');

var app = express();
app.use(bodyParser.json());

app.listen(3000, () => {
    console.log('Server started on port 3000');
});

//POST
app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    })
    todo.save().then(
        (doc) => {
            res.send(doc);
        },
        (error) => {
            res.status(400);
            res.send(error);

        }
    );

});

//GET
app.get('/todos', (req, res) => {
  
    Todo.find().then(
        (todos) => {
            res.send({todos});
        },
        (error) => {
            res.status(400);
            res.send(error);

        }
    );

});
module.exports = { app };

//