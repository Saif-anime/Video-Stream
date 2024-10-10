const mongoose = require('mongoose');

const VideoUploadSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    thumbnail:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },

    video:{
        type:String,
        required:true
    },


})



const VideoUpload = mongoose.model('VideoUpload', VideoUploadSchema);

module.exports = VideoUpload;


