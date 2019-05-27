const express = require('express')
const bodyParser= require('body-parser')
const app = express()
const multer = require('multer');
fs = require('fs-extra')
app.use(bodyParser.urlencoded({extended: true}))

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/home/app/songs')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

var upload = multer({ storage: storage })

app.get('/getfile/:id',function(req,res){
  res.sendFile('/home/songs/'+req.params.id);

});

app.post('/upload_song', upload.single('myFile'), (req, res, next) => {
  const file = req.file

  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 500
    return next(error)

  }
  res.send(file)
 
})
app.listen(3002, () => {
  console.log("Listening at :3002...");
});