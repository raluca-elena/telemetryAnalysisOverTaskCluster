var fs = require('fs');
var aws = require('aws-sdk');
aws.config.loadFromPath('./config.json');
var s3 = new aws.S3();
var argv = process.argv;
argv.shift();
argv.shift();
len = argv.length;
console.log("len is", len);
/*var toDownload = ["saved_session/Fennec/nightly/22.0a1/20130227030925.20131101.v2.log.cc03cd521ba84613808daf1e0d6d3ab6.lzma",
                  "saved_session/Fennec/nightly/22.0a1/20130329030904.20140310.v2.log.8ecdaa95df95421a8f50f7571d2c8954.lzma",
                  "saved_session/Fennec/nightly/22.0a1/20130401030817.20131215.v2.log.c0b69ad0de58425ba2c7774a72356381.lzma"];

var y = ['saved_session/Firefox/nightly/22.0a1/20130314030914.20131119.v2.log.427144b486634a60ae382496c86274cc.lzma',
         'saved_session/Firefox/nightly/22.0a1/20130314030914.20131119.v2.log.4ad2deacebd549cfae894aca1668a764.lzma',
         'saved_session/Firefox/nightly/22.0a1/20130314030914.20131119.v2.log.617d697487b84348a6a774894da58ccf.lzma'];
*/
var toDownload = argv.slice(0, 3);
var y = argv.slice(3, argv.length);

var proc = require('child_process').spawn('node', ['mapper.js']);

//write to parent stdout proc stdout
proc.stdout.on('data', function (data) {
    console.log('mapper stdout: ' + data);
});

//write to parent stderr proc stderr
proc.stderr.on('data', function(data) {
    process.stderr.write(data);
});

(function() {
while (toDownload.length !== 0) {
    createObj(toDownload.pop());
}})();

var filesRead = [];
function createObj(filename) {
    var writeStream = fs.createWriteStream('./' + filename.split('/').join('-'));
    s3.getObject({ Bucket: 'telemetry-published-v1', Key: filename})
        .createReadStream()
        .on("end", function () {
              proc.stdin.write(filename.split('/').join('-'));
              filesRead.push(filename);
              if (toDownload.length == 0 && y.length == 0) {
                  if (filesRead.length === len) {
                      console.log("files downloaded succesfully", filesRead);
                      proc.stdin.end();
                  }
              } else if (toDownload.length == 0 && y.length > 0) {
                    var x = y.pop();
                    createObj(x);
              } else {
                   console.log("I SHOULD NOT BE HERE :(((");
              }
        })
        .on("error", function() { console.log("got this data as error", arguments); })
        .pipe(writeStream);
}
