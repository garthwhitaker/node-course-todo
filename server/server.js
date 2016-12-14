const express = require('express');
const bodyParser = require('body-parser');

var mongoose = require('./db/mongoose');
var {User} = require('./models/User');
var {Todo} = require('./models/Todo');
var {ObjectID} = require('mongodb');

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

//GET /todos
app.get('/todos', (req, res) => {

    Todo.find().then(
        (todos) => {
            res.send({ todos });
        },
        (error) => {
            res.status(400);
            res.send(error);

        }
    );

});

//GET /todos/12312
app.get('/todos/:id', (req, res) => {

    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findById({_id: id})
    .then(
        (todo) => {
            if (!todo) {
                return res.status(404).send();
            }
            res.send({todo});

    }).catch((error) => {
            res.status(400);
            res.send();
    });

});



module.exports = { app };