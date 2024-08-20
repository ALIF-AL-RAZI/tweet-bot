const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path'); // Add this import
require('dotenv').config();
const { twitterClient } = require('./twitterClient.js');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

app.use('/images', express.static('upload/images'));

app.post('/tweet', upload.single('image'), async (req, res) => {
  try {
    const text = req.body.text;
    const image = req.file ? req.file.path : null;

    let mediaId = null;
    if (image) {
      mediaId = await twitterClient.v1.uploadMedia(image);
    }

    if(mediaId){
        await twitterClient.v2.tweet({
      text,
      media:  { media_ids: [mediaId] },
    });
    }
    else{
        await twitterClient.v2.tweet(text)
    }

    

    res.status(200).send('Tweet posted successfully!');
  } catch (error) {
    console.error('Error posting tweet:', error);
    res.status(500).send('Error posting tweet: ' + error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
