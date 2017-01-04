const {ObjectID} = require('mongodb');
const {Todo} = require('./../../server/models/Todo');
const {User} = require('./../../server/models/User');
const jwt = require('jsonwebtoken');
const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [
    {
        _id: userOneId,
        email: 'andrew@example.com',
        password: 'userOnePass',
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({ _id: userOneId, access: 'auth' }, 'abc123').toString()
            }
        ]
    },
    {
        _id: userTwoId,
        email: 'chanel@ail.com',
        password: 'userTwoPass'
    }

]
const todos = [
    { text: 'First test todo', _id: new ObjectID() },
    { text: 'Second test todo', _id: new ObjectID(), completed: true, completedAt: 333 }
];

const populateTodos = (done) => {
    Todo.remove({})
        .then(() => {
            return Todo.insertMany(todos);
        })
        .then(() => done());
};

const populateUsers = (done) => {
    User.remove({})
        .then(() => {
            var userOne = new User(users[0]).save();
            var userTwo = new User(users[1]).save();
            return Promise.all([userOne, userTwo]);
        })
        .then(() => done());
};

module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
}