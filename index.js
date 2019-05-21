const express = require('express');
const trackRoute = express.Router();
const multer = require('multer');

const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const { Readable } = require('stream');

const port = process.env.PORT || 3002;

const app = express();
app.use('/tracks', trackRoute);

/**
 * Connect Mongo Driver to MongoDB.
 */
let db;
MongoClient.connect('mongodb://upload_song_db:27017/trackDB', (err, client) => {
  if (err) {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    console.log(err)
    process.exit(1);
  }
  db = client.db('trackDB');
  
});


/**
 * POST /tracks
 */
trackRoute.post('/', (req, res) => {
    const storage = multer.memoryStorage()
    const upload = multer({ storage: storage, limits: { fields: 1, fileSize: 18000000, files: 1, parts: 2 }});
    upload.single('track')(req, res, (err) => {
      if (err) {
          console.log(err)
        return res.status(400).json({ message: "Upload Request Validation Failed" });
      } else if(!req.body.name) {
        return res.status(400).json({ message: "No track name in request body" });
      }
      
      let trackName = req.body.name;
      
      // Covert buffer to Readable Stream
      const readableTrackStream = new Readable();
      readableTrackStream.push(req.file.buffer);
      readableTrackStream.push(null);
  
      let bucket = new mongodb.GridFSBucket(db, {
        bucketName: 'tracks'
      });
  
      let uploadStream = bucket.openUploadStream(trackName);
      let id = uploadStream.id;
      readableTrackStream.pipe(uploadStream);
  
      uploadStream.on('error', () => {
        return res.status(500).json({ message: "Error uploading file" });
      });
  
      uploadStream.on('finish', () => {
        return res.status(201).json({ message: "File uploaded successfully, stored under Mongo ObjectID: " + id });
      });
    });
  });
  
  app.listen(port, () => {
    console.log("App listening on port "+port);
  });