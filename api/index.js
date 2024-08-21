const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();
const fs = require('fs');

const { twitterClient } = require('./twitterClient.js');
const { IgApiClient } = require('instagram-private-api');

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

app.post('/tweet', upload.array('images', 4), async (req, res) => { // Ensure 'images' matches the frontend
  try {
    const text = req.body.text;
    const imageFiles = req.files; // Array of uploaded images

    const mediaIds = [];
    if (imageFiles) {
      for (const image of imageFiles) {
        const mediaId = await twitterClient.v1.uploadMedia(image.path);
        mediaIds.push(mediaId);
      }
    }

    if(mediaIds.length > 0 ){
    await twitterClient.v2.tweet({
      text,
      media:  { media_ids: mediaIds },
    });
  }
  else{
    await twitterClient.v2.tweet(text)
  }


// console.log(imageFiles[0])

const ig = new IgApiClient();
ig.state.generateDevice(process.env.IG_USERNAME);
await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);

// For posting multiple photos as a carousel (Instagram album)
if (imageFiles.length > 1) {
  const albumFiles = imageFiles.map(image => ({
    file: fs.readFileSync(image.path),
  }));
  await ig.publish.album({
    items: albumFiles,
    caption: text,
  });
} else if (imageFiles.length === 1) {
  // For posting a single photo
  const fileBuffer = fs.readFileSync(imageFiles[0].path);
  await ig.publish.photo({
    file: fileBuffer,
    caption: text,
  });
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



// if(mediaIds){
//   await twitterClient.v2.tweet({
// text,
// media:  { media_ids: mediaIds },
// });
// }
// else{
//   await twitterClient.v2.tweet(text)
// }
