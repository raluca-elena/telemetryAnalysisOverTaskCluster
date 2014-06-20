var stdin = process.openStdin();
process.stdin.setEncoding('utf8');
process.stdout.setEncoding('utf8');
var x = 'saved_session-Fennec-nightly-22.0a1-20130329030904.20140310.v2.log.8ecdaa95df95421a8f50f7571d2c8954.lzma';
decompress = require('child_process').spawn('xz' , ['-c', '-d', x]);
decompress.stdout.setEncoding('utf8');
decompress.stdout.on('data', function (data) {
    //console.log("data is --------", data);
    //map.stdin.write(data);
});
decompress.on('close', function (code) {
    if (code !== 0) {
        //console.log('decompress process exited with code ' + code);
    }
    //map.stdin.end();
});

///
map  = require('child_process').spawn('./a.out');
map.stdout.on('data', function (data) {
    console.log('' + data);
});

map.stderr.on('data', function (data) {
    console.log('map stderr: ' + data);
});

map.on('close', function (code) {
    if (code !== 0) {
        console.log('map process exited with code ' + code);
    }
});
///
var count = 0;

stdin.on('data', function(chunk) {
    //console.log("the filename i got ", chunk);
    if (chunk != "END") {
        console.log("################## the filename i got ", chunk);
        console.log("/////////////////////////the pid for this process is ", decompress.pid);
        //process.stdout.write
        //decompress.stdin.write(['-d', "ralu.xz"]);
        //decompress.stdin.argv.push("ralu.xz");



        ////
        var r = 'saved_session-Firefox-nightly-22.0a1-20130314030914.20131119.v2.log.617d697487b84348a6a774894da58ccf.lzma';
        var z = "'" + chunk + "'";
        console.log("&&&&&&&&&", z);
        var y = 'saved_session-Fennec-nightly-22.0a1-20130329030904.20140310.v2.log.8ecdaa95df95421a8f50f7571d2c8954.lzma';
        decompress1 = require('child_process').spawn('xz' , ['-c', '-d', r]);
        decompress1.stdout.setEncoding('utf8');
        decompress1.stdout.on('data', function (data) {
            console.log("data is --------", data);
            map.stdin.write(data);
        });
        decompress1.on('close', function (code) {
            if (code !== 0) {
                console.log('decompress process exited with code ' + code);
            }
            //map.stdin.end();
        });


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
