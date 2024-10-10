const mongoose  = require('mongoose');

const conn = async() =>{
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/videos');
        console.log("connnection successfully");
    } catch (error) {
        console.log(error)
    }
}

conn();
module.exports = conn;