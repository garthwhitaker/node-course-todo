const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

    if (err) {
        return console.log('Unable to connect to MongoDb server');
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').findOneAndUpdate(
    //     { _id: new ObjectID('584fd8bdc0843edcbcb14594') },
    //     {
    //         $set: {
    //             completed: false
    //         }
    //     },
    //     {
    //         returnOriginal: false
    //     }
    // )
    // .then(
    // (result) => {console.log(result) },
    // () => { }
    // )

db.collection('Users').findOneAndUpdate(
        { _id: 123 },
        {
            $set: {
                name: "Garth"
            },
            $inc: {
                age: 1
            }

        },
        {
            returnOriginal: false
        }
    )
    .then(
    (result) => {console.log(result) },
    () => { }
    )

    // db.close();
});