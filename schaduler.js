var filesRead = [];
var fs = require('fs');

var aws = require('aws-sdk');
aws.config.loadFromPath('./config.json');
var s3 = new aws.S3();

var toDownload = ["saved_session/Fennec/nightly/22.0a1/20130227030925.20131101.v2.log.cc03cd521ba84613808daf1e0d6d3ab6.lzma",
                  "saved_session/Fennec/nightly/22.0a1/20130329030904.20140310.v2.log.8ecdaa95df95421a8f50f7571d2c8954.lzma",
                  "saved_session/Fennec/nightly/22.0a1/20130401030817.20131215.v2.log.c0b69ad0de58425ba2c7774a72356381.lzma"];

var y = ['saved_session/Firefox/nightly/22.0a1/20130314030914.20131119.v2.log.427144b486634a60ae382496c86274cc.lzma',
         'saved_session/Firefox/nightly/22.0a1/20130314030914.20131119.v2.log.4ad2deacebd549cfae894aca1668a764.lzma',
         'saved_session/Firefox/nightly/22.0a1/20130314030914.20131119.v2.log.617d697487b84348a6a774894da58ccf.lzma'];

var proc = require('child_process').spawn('node', ['listen.js']);

proc.stdin.on('data', function(data) {
    console.log("just smile to me please ", data);
    proc.stdin.pipe(process.stdout);

});
proc.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
    proc.stdout.pipe(process.stdout);
});


(function() {
for (var i = 0; i < toDownload.length; i++) {
    createObj(toDownload[i]);
}})();

function createObj(filename) {
    var writeStream = fs.createWriteStream('./' + filename.split('/').join('-'));
    writeStream.on("close", function(){});
    s3.getObject(
        { Bucket: 'telemetry-published-v1', Key: filename}
    ).createReadStream()
        .on("end", function () {
            if (y.length > 0 || toDownload.length > 0){
                //console.log("i am reading this particular stream --- ", filename);
                proc.stdin.write(filename.split('/').join('-') + '\n');
                filesRead.push(filename);
            }

            process.nextTick(function() {
                if (y.length == 0) {
                    proc.stdin.write("END");
                    //console.log("files downloaded", filesRead);
                    proc.unref();

                }
                if (y.length > 0) {
                    var x = y.pop();
                    createObj(x);
                }
            });
        })
        .on("error", function() { console.log("got this data as error", arguments); })
        .pipe(writeStream);
}




/// ---
