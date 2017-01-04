const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';
// var salt = bcrypt.genSalt(10, (err, salt) => {

//     bcrypt.hash(password, salt,(error,hash)=>{
//         console.log(hash)
//     });
// });


var hashedPassword = '$2a$10$tPWRHbF3RLfvpi8OUWW3LuINJmH5hnu3iU1IspsS6eI3UY5hyrtEG';
bcrypt.compare(password, hashedPassword, (error, result)=>{

console.log(result);
});
// var data = {
//     data: 44
// };

// var token = jwt.sign(data,'123abc');
// console.log(token);


// var  decoded= jwt.verify(token,'123abc');
// console.log(decoded);
// var message = 'Tom tom';
// console.log(`plain: ${message}, hash: ${SHA256(message).toString()}`);

// var data = {
//     data: 44
// }

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };

// // token.data.id  = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString()

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString()

// if(resultHash === token.hash)
// {
//     console.log('data was not changed');   
// }
// else
// {
//     console.log('data was changed');
// }