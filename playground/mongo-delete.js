const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

    if (err) {
        return console.log('Unable to connect to MongoDb server');
    }
    console.log('Connected to MongoDB server');

    //delete Many

    // db.collection('Todos').deleteMany({ text: "Having dinner"})
    //     .then((result) => {
    //         console.log(result)
    //     }, (error) => { console.log('Unable to delete.') });
    //delete one
    // db.collection('Todos').deleteOne({ text: "Get coffee"})
    //     .then((result) => {
    //         console.log(result)
    //     }, (error) => { console.log('Unable to delete.') });

    //findOneandDelete
    // db.collection('Todos').findOneAndDelete({ completed: true})
    //         .then((result) => {
    //             console.log(result)
    //         }, (error) => { console.log('Unable to delete.') });




    db.collection('Users').deleteMany({ name: 'Garth' })
        .then(
        (result) => { console.log(result) },
        (error) => { console.log(error) }
        );

    db.collection('Users').findOneAndDelete({ _id: new ObjectID("584fb779671fb415b753adbb") })
        .then(
        (result) => { console.log(result) },
        (error) => { console.log(error) }
        );
    // db.close();
});