const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/Todo');
const {User} = require('./../server/models/User');
const {ObjectID} = require('mongodb');

// Todo.remove({})
// .then((result)=>{
//     console.log(result);
// });

// Todo.findOneAndRemove
Todo.findByIdAndRemove('58527d126e37300d6ec9bd7b')
.then((todo)=>{
    console.log(todo);
});