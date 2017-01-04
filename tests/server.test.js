const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

const {app} = require('./../server/server');
const {Todo} = require('./../server/models/Todo');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');
const {User} = require('./../server/models/User');


beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST /todos', () => {

    it('should insert todos', (done) => {
        var text = 'Todo Item 1';
        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({ text })
            .expect(200)
            .expect((response) => {
                expect(response.body.text).toBe(text);
            })
            .end((err, res) => {

                if (err) {
                    return done(err);
                }

                Todo.find({ text })
                    .then((todos) => {
                        expect(todos.length).toBe(1);
                        expect(todos[0].text).toBe(text);
                        done();
                    })
                    .catch((error) => done(error))
            });
    });


    it('should not create todo with invalid data', (done) => {

        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({})
            .expect(400)
            .end((err, res) => {

                if (err) {
                    return done(err);
                }

                Todo.find()
                    .then((todos) => {
                        expect(todos.length).toBe(2);
                        done();
                    })
                    .catch((error) => done(error))
            });
    });
});

describe('GET /todos', () => {
    it('should find all todos', (done) => {

        request(app)
            .get('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((response) => {
                expect(response.body.todos.length).toBe(1);
            })
            .end(done);
    });



})

describe('GET /todos/:id', () => {

    it('should find todo doc', (done) => {

        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((response) => {
                expect(response.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should not find todo doc from other user', (done) => {

        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {

        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
    it('should return 404 if non object ids', (done) => {

        request(app)
            .get(`/todos/123`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
})

describe('DELETE /todos/:id', () => {

    var hexId = todos[1]._id.toHexString();

    it('should remove todo with id', (done) => {

        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect((response) => {
                expect(response.body.todo._id).toBe(hexId);
            })
            .end((err, resp) => {

                if (err) {
                    return done(err);
                }

                Todo.findById(hexId)
                    .then((todo) => {
                        expect(todo).toNotExist();
                        done();
                    })
                    .catch((err) => done(err));
            });
    });

 it('should not remove todo from other user', (done) => {

        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end((err, resp) => {

                if (err) {
                    return done(err);
                }

                Todo.findById(hexId)
                    .then((todo) => {
                        expect(todo).toExist();
                        done();
                    })
                    .catch((err) => done(err));
            });
    });


    it('should return 404 if invalid id', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .delete('/todos/123')
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);

    });

});

describe('PATCH /todos/:id', () => {

    it('should update todo', (done) => {

        var hexId = todos[0]._id.toHexString();
        var update = { text: 'Updated', completed: true };

        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .send(update)
            .expect(200)
            .expect((response) => {
                expect(response.body.todo.text).toBe(update.text);
                expect(response.body.todo.completed).toBe(update.completed);
                expect(response.body.todo.completedAt).toBeA('number');

            })
            .end(done);



    });

     it('should not update todo from other user', (done) => {

        var hexId = todos[0]._id.toHexString();
        var update = { text: 'Updated', completed: true };

        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .send(update)
            .expect(404)
            .end(done);
    });



    it('should update todo with completed false', (done) => {
        var hexId = todos[1]._id.toHexString();
        var update = { text: 'Updated the other', completed: false };

        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .send(update)
            .expect((response) => {
                expect(response.body.todo.text).toBe(update.text);
                expect(response.body.todo.completed).toBe(update.completed);
                expect(response.body.todo.completedAt).toNotExist();
            })
            .end(done);

    });


    it('should return 404 if invalid id', (done) => {
        request(app)
            .patch(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .patch('/todos/123')
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);

    });

});


describe('POST /users', () => {
    var email = 'travis@mail.com', password = '123mnb!';
    it('should create user', (done) => {
        request(app)
            .post('/users')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe('travis@mail.com');
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }

                User.findOne({ email })
                    .then((user) => {
                        expect(user).toExist();
                        expect(user.password).toNotBe('123123');
                        done();
                    })
            });



    });

    it('should return validation error if request invalid', (done) => {
        request(app)
            .post('/users')
            .send({ email: 'travis@maiasdl.com', password: '123' })
            .expect(400)
            .end(done);

    });

    it('should not create user if email is in use', (done) => {
        request(app)
            .post('/users')
            .send({ email: users[0].email, password: 'Password123!' })
            .expect(400)
            .end(done);
    });
});

describe('GET /users/me', () => {

    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);

    });
});


describe('POST /users/login', () => {

    it('should login user', (done) => {
        request(app)
            .post('/users/login')
            .send({ email: users[1].email, password: users[1].password })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body.email).toBe(users[1].email);
            })
            .end((error, res) => {
                if (error) {
                    return done(error);
                }

                User.findById(users[1]._id)
                    .then((user) => {
                        expect(user.tokens[1]).toInclude({ access: 'auth', token: res.headers['x-auth'] });
                        done();
                    })
                    .catch((e) => done(e));

            });

    });

    it('should reject invalid user', (done) => {
        request(app)
            .post('/users/login')
            .send({ email: users[1].email, password: 'qwewqe' })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((error, res) => {
                if (error) {
                    return done(error);
                }

                User.findById(users[1]._id)
                    .then((user) => {
                        expect(user.tokens.length).toBe(1);
                        done();
                    })
                    .catch((e) => done(e));

            });
    });
});

describe('DELETE /users/me/token', () => {

    it('should remove token on logout', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((error, res) => {
                if (error) {
                    return done(error);
                }

                User.findById(users[0]._id)
                    .then((user) => {
                        expect(user.tokens.length).toBe(0);
                        done();
                    })
                    .catch((e) => done(e));

            });

    });


});