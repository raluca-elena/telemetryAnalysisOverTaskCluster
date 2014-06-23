var yaml = require('js-yaml');
var fs   = require('fs');
var doc = yaml.safeLoad(fs.readFileSync('./contract.yml', 'utf8'));
var stdin = process.openStdin();
var pr;

if (doc.language == 'python') {
    pr = require('child_process').spawn('./python-helper.py', ['mapper']);
} else if (doc.language == '') {
    pr = require('child_process').spawn(doc.script, doc.arguments);
} else if (doc.language == 'javascript') {
    pr = process.spawn('node', [doc.script]);
}

pr.on('exit', function(code){
    console.log("MAPPER exit code", code);
})

if (doc.decompress) {
    decompress();
} else {
    stdin.on('data', function (data) {
        console.log("file sent to mapper", data.toString());
        pr.stdin.write(data + "\n");
    });
}

function decompress() {
    var decompress = require('child_process').spawn('./decompress.sh');

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
