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


(function() {
for (var i = 0; i < toDownload.length; i++) {
    console.log("****************************i is ", i, "~~~~~~~~~~~", toDownload[i]);
    createObj(toDownload[i]);
}})();

function createObj(filename) {
    //console.log("IF filename=", filename, "toDownload: ", toDownload, "y: ", y);
    console.log("createobj   -----start filename----", filename);
    var writeStream = fs.createWriteStream('./' + filename.split('/').join('-'));
    writeStream.on("end", function(){console.log("WEND");});
    writeStream.on("close", function(){console.log("W close");});
    s3.getObject(
        { Bucket: 'telemetry-published-v1', Key: filename}
    ).createReadStream()
        .on("end", function () {
            //console.log("END: filename=", filename, "toDownload: ", toDownload, "y: ", y);
            process.nextTick(function() {
                if (y.length > 0) {
                    var x = y.pop();
                    console.log("x is %%%%%%%%%%%%%%%%%", x);
                    createObj(x);
                }
            });
        })
        .on("error", function() { console.log("CACA", arguments); })
        .pipe(writeStream);
}



/// ---
