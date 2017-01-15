const request = require( 'request' );
const fs = require( 'fs' );
const progress = require( 'request-progress' );

const videoID = process.argv[ 2 ];

const headers = {
  'Referer': 'http://fast.wistia.net/embed/iframe/' + videoID
};

var options = {
  url: 'http://fast.wistia.net/embed/medias/' + videoID + '.json',
  headers: headers
};

// get the video JSON
request( options, callback );

function callback( error, response, body ) {

  if ( !error && response.statusCode == 200 ) {
    parseVideoURL( JSON.parse(body).media.assets );
  } else {
    console.log( 'There was a problem', error, response.statusCode );
  }
}

function parseVideoURL( data ){

  let video = data.find( ( element ) => {
    return element.type === 'hd_mp4_video';
  });

  progress(request( video.url, {} )
    .on( 'progress', ( state) => {
      console.log(
        'progress:', state.percent * 100 + '% - ('
        + state.size.transferred + '/' + state.size.total + 'bytes at '
        + state.speed + 'bytes/sec) - '
        + state.time.elapsed + 'seconds elapsed, '
        + state.time.remaining + 'seconds remaining'
      );
    })
    .on( 'error', ( err ) => {
      console.log( err )
    })
    .on( 'end', () => {
      console.log( 'video downloaded and saved' );
    })
    .pipe( fs.createWriteStream( './videos/' + videoID + '.' + video.ext )));
}
