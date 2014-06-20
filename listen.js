var stdin = process.openStdin();
process.stdin.setEncoding('utf8');
process.stdout.setEncoding('utf8');
var x = 'saved_session-Fennec-nightly-22.0a1-20130329030904.20140310.v2.log.8ecdaa95df95421a8f50f7571d2c8954.lzma';
decompress = require('child_process').spawn('xz' , ['-c', '-d', x]);
decompress.stdout.setEncoding('utf8');
decompress.stdout.on('data', function (data) {
    console.log("data is --------", data);
    //map.stdin.write(data);
});
decompress.on('close', function (code) {
    if (code !== 0) {
        console.log('decompress process exited with code ' + code);
    }
    //map.stdin.end();
});

var count = 0;

stdin.on('data', function(chunk) {
    //console.log("the filename i got ", chunk);
    if (chunk != "END") {
        console.log("################## the filename i got ", chunk);
        console.log("/////////////////////////the pid for this process is ", decompress.pid);
        //process.stdout.write
        //decompress.stdin.write(['-d', "ralu.xz"]);
        //decompress.stdin.argv.push("ralu.xz");

    }
    if (chunk == "END") {
        count++;
        console.log("i should discunnect ------- ");
        if (count == 3) {
            console.log("i reached 3-----");
            //process.exit();
            stdin.end();
        }

    }
    console.log("Got chunk: " + chunk);
});
