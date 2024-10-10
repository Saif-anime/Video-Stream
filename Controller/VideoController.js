const express = require('express');
const path = require('path');
const Video = require('../SchemaData/VideoUpload');
const multer = require('multer')
const fs = require('fs');
const app = express();


const uploadingfol = path.join(__dirname, '../upload');

console.log(uploadingfol)


// Define the storage for images and videos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadingfol); // Use the same directory for both
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

    if (file.fieldname === 'avatar') {
      cb(null, 'avatar-' + uniqueSuffix + '.jpg');
    } else if (file.fieldname === 'video') {
      cb(null, 'video-' + uniqueSuffix + '.mp4');
    } else {
      cb(new Error('Unexpected field')); // Handle unexpected fields
    }
  }
});

// Create a single upload instance
const upload = multer({ storage: storage });

app.get("/video", async(req, res) => {

  const video = await Video.find();

  res.send(video);

})

app.get('/video/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const video = await Video.findById(id); // Fetch the video record
    if (!video) {
      return res.status(404).send('Video not found');
    }
    console.log(video.video)
    const videoPath = `./upload/${video.video}`; // Assuming `video` holds the path to the video file
    const stat = fs.statSync(videoPath); // Get the file stats

    // Set headers for streaming
    res.writeHead(200, {
      'Content-Type': 'video/mp4',
      'Content-Length': stat.size,
      'Accept-Ranges': 'bytes'
    });

    // Stream the video file
    const readStream = fs.createReadStream(videoPath);
    readStream.pipe(res);

    // Handle stream errors
    readStream.on('error', (err) => {
      console.error(err);
      res.status(500).send('Error streaming video');
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching video: ' + error.message);
  }

})


app.post("/video", upload.fields([{ name: 'avatar' }, { name: 'video' }]), async (req, res) => {
  try {
    const title = req.body.title;
    const desc = req.body.des;
    const thumbnail = req.files['avatar'][0].filename; // Path to the uploaded thumbnail
    const video = req.files['video'][0].filename; // Path to the uploaded video

    // Create a new Video instance
    const vide_upload = await Video.create({
      title: title,
      description: desc,
      thumbnail: thumbnail,
      video: video
    });

    res.status(201).send('Video uploaded successfully: ' + vide_upload);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading video: ' + error.message);
  }


})





module.exports = app;


