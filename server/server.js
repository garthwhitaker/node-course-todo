require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT;

var mongoose = require('./db/mongoose');
var {User} = require('./models/User');
var {Todo} = require('./models/Todo');
var {ObjectID} = require('mongodb');


var app = express();
app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
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

    Todo.findById({ _id: id })
        .then(
        (todo) => {
            if (!todo) {
                return res.status(404).send();
            }
            res.send({ todo });

        }).catch((error) => {
            res.status(400);
            res.send();
        });

});


//DELETE /todos/12312
app.delete('/todos/:id', (req, res) => {

    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id)
        .then(
        (todo) => {
            if (!todo) {
                return res.status(404).send();
            }
            res.send({ todo });

        }).catch((error) => {
            res.status(400);
            res.send();
        });

});


//PATCH /todos/12312
app.patch('/todos/:id', (req, res) => {

    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime(); //epoch
    }
    else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
        .then((todo) => {
            if (!todo) {
                return res.status(404).send();
            }
            res.send({ todo });

        })
        .catch((error) => {
            res.status(400);
            res.send(error);
        })

});

// POST /users
app.post('/users', (req, res) => {

    var body = _.pick(req.body, ['email', 'password']);

    var user = new User(body);

    user.save()
        .then(() => {
            return user.generateAuthToken();
        })
        .then((token) => {
            res.header('x-auth',token).send(user);
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        });
})




module.exports = { app };