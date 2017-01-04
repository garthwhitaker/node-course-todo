const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    data: 44
};

var token = jwt.sign(data,'123abc');
console.log(token);


var  decoded= jwt.verify(token,'123abc');
console.log(decoded);
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