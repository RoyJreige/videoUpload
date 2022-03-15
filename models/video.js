const mongoose = require('mongoose');


const VideoSchema = new mongoose.Schema({
    filePath:{
        type: String,
    },
    insertedAt:{
        type: Date,
      default: Date.now(),
    },
    name:{type: String,
    default: 'hello'}
});

const Video = mongoose.model('Video', VideoSchema);


module.exports = Video;