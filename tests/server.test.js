const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

const {app} = require('./../server/server');
const {Todo} = require('./../server/models/Todo');
const todos = [
    { text: 'First test todo', _id: new ObjectID() },
    { text: 'Second test todo', __id: new ObjectID()}
]
describe('POST /todos', () => {

    beforeEach((done) => {
        Todo.remove({})
            .then(() => {
                Todo.insertMany(todos);

            })
            .then(() => done());
    });

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

