const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Set storage for uploaded files
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.static('public'));

app.post('/upload', upload.single('file'), (req, res) => {
  res.sendStatus(200);
});

app.get('/list', (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      res.sendStatus(500);
    } else {
      res.json(files);
    }
  });
});

app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);
  
  res.download(filePath, filename, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.sendStatus(500);
    }
  });
});

app.get('/view/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error viewing file:', err);
      res.sendStatus(500);
    }
  });
});

app.get('/share/:filename', (req, res) => {
  const filename = req.params.filename;
  const shareLink = `http://your-domain.com/download/${filename}`; // Replace with your actual domain
  
  res.send(`Share this link: <a href="${shareLink}">${shareLink}</a>`);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
