const request = require('request');

const videoID = process.argv[2];
const format = process.argv[3];

const headers = {
  'Referer': 'http://fast.wistia.net/embed/iframe/' + videoID
};

var options = {
  url: 'http://fast.wistia.net/embed/medias/' + videoID + '.json',
  headers: headers
};

// get the video JSON
request(options, callback);

function callback(error, response, body) {

  if (!error && response.statusCode == 200) {
    parseVideoURL( JSON.parse(body).media.assets );
  } else {
    console.log( 'There was a problem', error, response.statusCode );
  }
}

function parseVideoURL( data ){

  let originalVideo = data.find( ( element ) => {
    return element.type === 'original';
  });

  console.log(originalVideo);
}
