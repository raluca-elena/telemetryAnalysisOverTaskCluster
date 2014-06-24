var yaml = require('js-yaml');
var fs   = require('fs');
var child_process = require('child_process');

var doc = yaml.safeLoad(fs.readFileSync('./mapper.yml', 'utf8'));
var stdin = process.openStdin();
var pr;

if (doc.language == 'python') {
    pr = child_process.spawn('./python-helper.py', ['mapper']);
} else if (doc.language == '') {
    pr = child_process.spawn(doc.script, doc.arguments);
} else if (doc.language == 'javascript') {
    pr = child_process.spawn('node', [doc.script]);
} else if (doc.language == 'python1') {
    console.log("MAMASMDASD: ");
    pr = child_process.spawn('./python-helper-function.py', ['mapper', 'true']);
    //stdin.on("end", function() { pr.stdin.end(); })
    console.log("ZOMG@");
} else {
    console.log("OMG:", doc.language);
    // TODO: crash in flames!
}

/*
pr.on('exit', function(code){
    console.log("MAPPER exit code", code);
})
*/

if (doc.decompress) {
    decompress();
} else {
    stdin.on('data', function (data) {
        console.log("file sent to mapper", data.toString());
        pr.stdin.write(data);
    });
    stdin.on("end", function() { pr.stdin.end(); })
}

function decompress() {
    var decompress = child_process.spawn('./decompress.sh');

    stdin.on('data', function (data) {
        console.log("file sent to decompression is ", data.toString());
        decompress.stdin.write(data + "\n");
    });

    decompress.stdout.on('data', function (data) {
        pr.stdin.write(data);
    });

    stdin.on("end", function () {
        decompress.stdin.end();
    });

    decompress.stdout.on("end", function () {
        pr.stdin.end();
    });
}
