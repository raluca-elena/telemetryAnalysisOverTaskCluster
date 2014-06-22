/*yaml = require('js-yaml');
fs   = require('fs');
var doc = yaml.safeLoad(fs.readFileSync('./contract.yml', 'utf8'));
var pr = require('child_process').spawn('python', ['helloWorld.py'], '-u');
pr.stdout.pipe(process.stdout);
var pid = pr.pid;
console.log("the pid is ", pid);*/
count = 0;
var stdin = process.openStdin();
//process.stderr.setEncoding('utf8');
process.stdin.setEncoding('utf8');

var b = require('child_process').spawn('./b.sh');
b.stdout.on('data', function(data){
    console.log("DATA: ", data);

});
stdin.on('data', function(data){
    console.log("DATA GIVEN  to my child is", data);
    console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
    var x = b.stdin.write(data + "\n");
    count++;
    console.log("WROTE TO CHILD ====", x, " count is  ", count);

    if (count == 6) {
        console.log("END");
        b.stdin.end();
        stdin.end();
    }
});
b.stdout.on('data', function (data) {
    console.log('Bstdout: ' + data);
    console.log("--------------------------------------");
    //proc.stdout.pipe(process.stdout);
});


//b.stdin.write("saved_session-Fennec-nightly-22.0a1-20130227030925.20131101.v2.log.cc03cd521ba84613808daf1e0d6d3ab6.lzma\n");
//b.stdin.end();
//console.log("DONE");




