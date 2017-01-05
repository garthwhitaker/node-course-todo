require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT;
const {ObjectID} = require('mongodb');

var mongoose = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user')
var {authenticate} = require('./middleware/authenticate')


var app = express();
app.use(bodyParser.json());



//POST
app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
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
app.get('/todos', authenticate, (req, res) => {

    Todo.find({ _creator: req.user._id }).then(
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
app.get('/todos/:id', authenticate, (req, res) => {

    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findOne({ _id: id, _creator: req.user._id })
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
app.delete('/todos/:id', authenticate, (req, res) => {

    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findOneAndRemove({ _id: id, _creator: req.user.id })
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
app.patch('/todos/:id', authenticate, (req, res) => {

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

    Todo.findOneAndUpdate({ _id: id, _creator: req.user.id }, { $set: body }, { new: true })
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



/* Users routes */
// POST /users
app.post('/users', (req, res) => {

    var body = _.pick(req.body, ['email', 'password']);

    var user = new User(body);

    user.save()
        .then(() => {
            return user.generateAuthToken();
        })
        .then((token) => {
            res.header('x-auth', token).send(user);
        })
        .catch((err) => {
            res.status(400);
            res.send(err);
        });
});

//GET /users/me
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

//POST /users/login
app.post('/users/login', (req, res) => {

    var body = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(body.email, body.password)
        .then((user) => {
            return user.generateAuthToken()
                .then((token) => {
                    res.header('x-auth', token).send(user);
                })

        })
        .catch((err) => {
            res.status(400);
            res.send();
        });

});

//DELETE /users/me/token
app.delete('/users/me/token', authenticate, (req, res) => {

    req.user.removeToken(req.token)
        .then(
        () => { res.status(200).send() },
        () => { res.status(400).send() })
});


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

module.exports = { app };