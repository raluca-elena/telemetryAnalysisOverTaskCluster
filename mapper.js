var yaml = require('js-yaml');
var fs   = require('fs');
var doc = yaml.safeLoad(fs.readFileSync('./contract.yml', 'utf8'));
var count = 0;
var stdin = process.openStdin();
if (doc.language == 'python') {
    var pr = require('child_process').spawn('./python-helper.py', ['mapper']);
    var pid = pr.pid;
    console.log("====================the pid is ", pid);
    console.log("language is ------", doc.language);
    if (doc.decompress) {
        decompress();
    }
}

function decompress() {
    var decompress = require('child_process').spawn('./decompress.sh');

    stdin.on('data', function (data) {
        console.log("DATA GIVEN  to my child is", data.toString());
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
        var x = decompress.stdin.write(data + "\n");
        console.log("WROTE TO CHILD ====", x, " count is  ", count);
        count++;

    });

    decompress.stdout.on('data', function (data) {
        //console.log("DATA: ", data.toString());
        pr.stdin.write(data);
    });



    stdin.on("end", function () {
        decompress.stdin.end();
    });

    decompress.stdout.on("end", function () {
        pr.stdin.end();
    });
}


//b.stdin.write("saved_session-Fennec-nightly-22.0a1-20130227030925.20131101.v2.log.cc03cd521ba84613808daf1e0d6d3ab6.lzma\n");
//b.stdin.end();
//console.log("DONE");




