const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

const {app} = require('./../server/server');
const {Todo} = require('./../server/models/Todo');
const todos = [
    { text: 'First test todo', _id: new ObjectID() },
    { text: 'Second test todo', _id: new ObjectID(), completed: true, completedAt: 333 }
];

beforeEach((done) => {
        Todo.remove({})
            .then(() => {
                Todo.insertMany(todos);

            })
            .then(() => done());
    });

describe('POST /todos', () => {

    it('should insert todos', (done) => {
        var text = 'Todo Item 1';
        request(app)
            .post('/todos')
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

    it('should find all todos', (done) => {

        request(app)
            .get('/todos')
            .expect(200)
            .expect((response) => {
                expect(response.body.todos.length).toBe(2);
            })
            .end(done);
    });



})

describe('GET /todos/:id', () => {

    it('should find todo doc', (done) => {

        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((response) => {
                expect(response.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {

        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });
    it('should return 404 if non object ids', (done) => {

        request(app)
            .get(`/todos/123`)
            .expect(404)
            .end(done);
    });
})

describe('DELETE /todos/:id', () => {

    var hexId = todos[1]._id.toHexString();

    it('should remove todo with id', (done) => {

        request(app)
            .delete(`/todos/${hexId}`)
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

    it('should return 404 if invalid id', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .delete('/todos/123')
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
            .send(update)
            .expect(200)
            .expect((response) => {
                expect(response.body.todo.text).toBe(update.text);
                expect(response.body.todo.completed).toBe(update.completed);
                expect(response.body.todo.completedAt).toBeA('number');

            })
            .end(done);



    });



    it('should update todo with completed false', (done) => {
        var hexId = todos[1]._id.toHexString();
        var update = { text: 'Updated the other', completed: false };

        request(app)
            .patch(`/todos/${hexId}`)
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
            .expect(404)
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .patch('/todos/123')
            .expect(404)
            .end(done);

    });

});
