const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/Todo');
const {User} = require('./../server/models/User');
const {ObjectID} = require('mongodb');

// var id = '58500808971f402242c30f2a11';
// if(!ObjectID.isValid(id))
// {
//     console.log('ID not valid.');
// }
// Todo.find({_id: id})
//     .then(
//         (todos) => {
//             if(todos.length == 0)
//             {
//                 return console.log('No results found');
//             } 
//             console.log(JSON.stringify(todos, undefined, 2)) },
//         (error) => { console.log('Unable to find.', error) }
//     );

// Todo.findOne({_id: id})
//     .then(
//         (todo) => { 
//              if(!todo)
//             {
//                 return console.log('No results found');
//             } 
//             console.log(JSON.stringify(todo, undefined, 2)) },
//         (error) => { console.log('Unable to find.', error) }
//     );

// Todo.findById({_id: id})
//     .then(
//         (todo) => { 
//              if(!todo)
//             {
//                 return console.log('No results found');
//             } 
//             console.log(JSON.stringify(todo, undefined, 2)) },
//         (error) => { console.log('Unable to find.', error) }
//     )
//     .catch((error)=>{
//         console.log(error);
//     });

var userId = '584fec473a17591dc5aa73e411';
User.findById({_id: userId})
    .then(
        (user) => {
            if (!user) {
                return console.log('User not found.');
            }
            console.log(JSON.stringify(user, undefined, 2));
        }
    )
    .catch((error) => {
        console.log(error);
    });
