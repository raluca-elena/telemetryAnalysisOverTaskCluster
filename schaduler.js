var aws = require('aws-sdk');
aws.config.loadFromPath('./config.json');
var fs = require('fs');
var s3 = new aws.S3();
var f;

var toDownload = ["saved_session/Fennec/nightly/22.0a1/20130227030925.20131101.v2.log.cc03cd521ba84613808daf1e0d6d3ab6.lzma",
                  "saved_session/Fennec/nightly/22.0a1/20130329030904.20140310.v2.log.8ecdaa95df95421a8f50f7571d2c8954.lzma",
                  "saved_session/Fennec/nightly/22.0a1/20130401030817.20131215.v2.log.c0b69ad0de58425ba2c7774a72356381.lzma"];


var futureDownload = ['saved_session/Firefox/nightly/22.0a1/20130314030914.20131115.v2.log.1cfa09553d5144b59f5ae1827becddfc.lzma',
    'saved_session/Firefox/nightly/22.0a1/20130314030914.20131115.v2.log.fdcb4b850c8f4702aeef040784c191f9.lzma',
    'saved_session/Firefox/nightly/22.0a1/20130314030914.20131116.v2.log.5ff7a89dc6ee49d2891f318995aaca44.lzma',
    'saved_session/Firefox/nightly/22.0a1/20130314030914.20131117.v2.log.7a83b0916ee948cd91252494c6560ced.lzma',
    'saved_session/Firefox/nightly/22.0a1/20130314030914.20131117.v2.log.aac5a47ce1634c73866a4674482260d5.lzma',
    'saved_session/Firefox/nightly/22.0a1/20130314030914.20131117.v2.log.f240bd668bda494ca747172630a029bc.lzma',
    'saved_session/Firefox/nightly/22.0a1/20130314030914.20131118.v2.log.9e1b865994584a8490cd7bd5b626b777.lzma',
    'saved_session/Firefox/nightly/22.0a1/20130314030914.20131119.v2.log.427144b486634a60ae382496c86274cc.lzma',
    'saved_session/Firefox/nightly/22.0a1/20130314030914.20131119.v2.log.4ad2deacebd549cfae894aca1668a764.lzma',
    'saved_session/Firefox/nightly/22.0a1/20130314030914.20131119.v2.log.617d697487b84348a6a774894da58ccf.lzma'];

/*var proc = require('child_process').spawn('node', ['proc.js']);

proc.stdin.setEncoding('utf8');
proc.stdout.setEncoding('utf8');
proc.stderr.setEncoding('utf8');

//proc.stdin.write('stop\n');
proc.stdin.on('data', function(data) {

})
proc.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
});*/
//    proc  = spawn('node', ['proc.js']);
var inTheProcess = [];
var processed = [];
var aws = require('aws-sdk');
aws.config.loadFromPath('./config.json');
var sync = false;
var count = 0;
for (var i = 0; i < toDownload.length; i++) {
    console.log("****************filename passed", toDownload[i]);
    var filename = toDownload[i];
    var writeStream = require('fs').createWriteStream('./' + filename.split('/').join('-'));
    s3.getObject(
        { Bucket: 'telemetry-published-v1', Key: filename},
        function (error, data) {
            if (error != null) {
                console.log("Failed to retrieve an object: " + error);
            } else {
                console.log("Loaded file with name " + filename  + " that has this size " + data.ContentLength);
            }
        }
    ).createReadStream().on("end",function() {
            count++;
            console.log(" my count is ", count);}).pipe(writeStream);
    inTheProcess.push(filename.split('/').join('-'));
    console.log("in the process looks like", inTheProcess);
};

for (var i = 0; i < toDownload; i++) {

}
function removeFromList(filename) {
    var i = toDownload.indexOf(filename);
    if (i != -1) {
        //console.log("------");
        console.log("removing this file", filename, "-------", toDownload[i]);
        toDownload.splice(i, 1);
    } else {
        //console.log("------");
        console.log("no file with this name ", filename) ;
    }
}


//console.log("in the process looks like", inTheProcess);

