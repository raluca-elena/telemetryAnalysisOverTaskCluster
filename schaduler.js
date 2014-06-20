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


while (y.length !== 0 || toDownload.length !== 0) {
    (function() {
        if (toDownload.length !== 0) {
            var filename = toDownload.pop();
            console.log("IF filename=", filename, "toDownload: ", toDownload, "y: ", y);

            var writeStream = require('fs').createWriteStream('./' + filename.split('/').join('-'));
            s3.getObject(
                { Bucket: 'telemetry-published-v1', Key: filename},
                function (error, data) {
                    console.log("CB: filename=", filename, "toDownload: ", toDownload, "y: ", y);
                    if (error != null) {
                        console.log("Failed to retrieve an object: " + error);
                    } else {
                        console.log("Loaded file with name ~~~~~" + filename + " that has this size " + data.ContentLength);
                    }
                }
            ).createReadStream().on("end", function () {
                    //console.log("END: filename=", filename, "toDownload: ", toDownload, "y: ", y);

                    if (y.length > 0) {
                        var x = y.pop();
                        //console.log("file is ", x);
                        toDownload.push(x);
                    }
                }).pipe(writeStream);
        } else {
            var filename = y.pop();
            //console.log("ELSE: filename=", filename, "toDownload: ", toDownload, "y: ", y);
            toDownload.push(filename);
        }
    })();
}



/// ---
