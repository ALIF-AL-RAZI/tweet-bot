const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config({ path: __dirname + '/.env' });

const app = express();
const port = 5000;
const { twitterClient } = require('./twitterClient.js');

app.use(cors());
app.use(express.json());

app.post('/tweet', async (req, res) => {
    try {
        const text = req.body.text;
        await twitterClient.v2.tweet(text);
        res.status(200).send('Tweet posted successfully!');
    } catch (error) {
        res.status(500).send('Error posting tweet: ' + error.message);
    }
});

// Optional: Uncomment to send a tweet when the server starts
// const tweet = async () => {
//   try {
//     await twitterClient.v2.tweet("Hello world!");
//   } catch (e) {
//     console.log(e);
//   }
// };
// tweet();

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
