var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');
// mongoose.connect('mongodb://garth:password@ds133438.mlab.com:33438/todoapplication');

module.exports = {
    mongoose
};