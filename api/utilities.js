const request = require("request");
const fs = require("fs");

const download = function (uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    if (err) {
      console.log('Error in downloading the image:', err);
      return;
    }
    request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
  });
};

module.exports = { download };
