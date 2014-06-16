/**
 * Created by rpodiuc on 6/14/14.
 */
var aws = require('aws-sdk');
aws.config.loadFromPath('./config.json');
var fs = require('fs');
var s3 = new aws.S3();
//list of file names from mreid db
var l = [ 'saved_session/Fennec/nightly/22.0a1/20130227030925.20131101.v2.log.cc03cd521ba84613808daf1e0d6d3ab6.lzma',
  'saved_session/Fennec/nightly/22.0a1/20130329030904.20140310.v2.log.8ecdaa95df95421a8f50f7571d2c8954.lzma'];

//upload files to interm bucket
function uploadFile(remoteFilename, fileName) {
  var fileBuffer = fs.readFileSync(fileName);
  var metaData = getContentTypeByFile(fileName);

  s3.putObject({
    ACL: 'public-read',
    Bucket: 'ralu-telemetry-analysis',
    Key: remoteFilename,
    Body: fileBuffer,
    ContentType: metaData
  }, function(error, response) {
    console.log('uploaded file[' + fileName + '] to [' + remoteFilename + '] as [' + metaData + ']');
    console.log(arguments);
  });
}

//uploadFile("ralu/ralu1/ralu2", "./ralu");

//not sure if i really need this
function getContentTypeByFile(fileName) {
  var rc = 'application/octet-stream';
  var fn = fileName.toLowerCase();

  if (fn.indexOf('.html') >= 0) rc = 'text/html';
  else if (fn.indexOf('.txt') >= 0) rc = 'text/txt';
  else if (fn.indexOf('.json') >= 0) rc = 'application/json';
  else if (fn.indexOf('.js') >= 0) rc = 'application/x-javascript';
  else if (fn.indexOf('.png') >= 0) rc = 'image/png';
  else if (fn.indexOf('.jpg') >= 0) rc = 'image/jpg';

  return rc;
}

/*s3.getObject(
  { Bucket: 'ralu-telemetry-analysis', Key: "ralu/ralu1/ralu2" },
  function (error, data) {
    if (error != null) {
      console.log("Failed to retrieve an object: " + error);
    } else {
      console.log("Loaded " + data.ContentLength + " bytes");
      // do something with data.body
    }
  }
);*/

var file = require('fs').createWriteStream('./' + 'saved_session/Fennec/nightly/22.0a1/20130227030925.20131101.v2.log.cc03cd521ba84613808daf1e0d6d3ab6.lzma'.split('/').join('-'));

s3.getObject(
  { Bucket: 'telemetry-published-v1', Key: "saved_session/Fennec/nightly/22.0a1/20130227030925.20131101.v2.log.cc03cd521ba84613808daf1e0d6d3ab6.lzma" },
  function (error, data) {
    if (error != null) {
      console.log("Failed to retrieve an object: " + error);
    } else {
      console.log("Loaded " + data.ContentLength + " bytes");
      // do something with data.body
    }
  }
).createReadStream().pipe(file);

var f;
l.forEach(function(filename){
  var writeStream = fs.createWriteStream('./' + filename.split('/').join('-'));
  s3.getObject(
    { Bucket: 'telemetry-published-v1', Key: filename},
    function (error, data) {
      if (error != null) {
        console.log("Failed to retrieve an object: " + error);
      } else {
        console.log("Loaded " + data.ContentLength + " bytes");
        // do something with data.body
      }
    }
  ).createReadStream().pipe(writeStream);
});






