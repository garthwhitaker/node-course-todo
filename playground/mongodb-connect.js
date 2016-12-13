const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

    if (err) {
        return console.log('Unable to connect to MongoDb server');
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').insertOne({
    //     text: 'Something',
    //     completed: false

    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert document', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

       db.collection('Users').insertOne({
            name: 'Garth',
            age: 31,
            location: '10 Olive Street'

        }, (err, result) => {
            if (err) {
                return console.log('Unable to insert document', err);
            }
            console.log(JSON.stringify(result.ops, undefined, 2));
            console.log(result.ops[0]._id.getTimestamp());
        });

    db.close();
});