var stdin = process.openStdin();
var decompressed = [];
process.stderr.setEncoding('utf8');
process.stdin.setEncoding('utf8');
var mapCalls = 0;
var r = 'saved_session-Firefox-nightly-22.0a1-20130314030914.20131119.v2.log.617d697487b84348a6a774894da58ccf.lzma';
var x = 'saved_session-Fennec-nightly-22.0a1-20130329030904.20140310.v2.log.8ecdaa95df95421a8f50f7571d2c8954.lzma';

map  = require('child_process').spawn('./a.out');

map.stdin.on('data', function(data) {
    //console.log("mapCalls are ", mapCalls);
    //console.log("this is my data ----- ", data);
    mapCalls++;
});

map.stdout.on('data', function (data) {
    map.stdout.pipe(process.stdout);
});

map.stderr.on('data', function (data) {
    console.log('map stderr: ' + data);
    map.stderr.pipe(process.stderr);
});

map.on('close', function (code) {
    if (code !== 0) {
        console.log('MAP ******************* ' + code);
    } else
        console.log("tha daaaaaa, map calls", mapCalls);
});
///
var count = 0;

stdin.on('data', function(chunk) {
    //console.log("the filename i got is", chunk);
    //var r = "'" + chunk + "'";
    //console.log(r);


    if (chunk != "END") {
        console.log("------------I got called with this name ", chunk);
        decompress = require('child_process').spawn('xz' , ['-c', '-d', x]);
        decompressed.push(x);
        decompress.stdout.on('data', function (data) {
            map.stdin.write(data);
            console.log("i white this data to map   ", data);
            //console.log("arguments i got ----");
        });
        decompress.on('close', function (code) {

            if (code !== 0) {
                console.log('decompress process exited with code ****' + code + "unsuccesful decompress of " + decompressed[decompressed.length-1]);
                decompressed.pop();
            }
            if (code == 0)
                console.log("---------Decompress exit right ", decompressed[decompressed.length-1]);
        });

    }
    if (chunk == "END") {
        count++;
        if (count == 3) {
            console.log("i reached 3-----");
            //map.stdin.end();
            //console.log("decompressed is -----", decompressed);
            map.stdin.end();
            stdin.end();

        }

    }
});
