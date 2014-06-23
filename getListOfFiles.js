var request = require('superagent');
var files;
var dbUrl = 'http://ec2-54-203-209-235.us-west-2.compute.amazonaws.com:8080/files';
var myRealServ = "http://ec2-54-185-133-18.us-west-2.compute.amazonaws.com:8080/files";
var myFakeServ = "http://localhost:8080/files";

//i should parse a json for this and make requests accordingly
var testFilter = {"filter":{"version":1,"dimensions":[
    {"field_name":"reason","allowed_values":["saved-session"]},
    {"field_name":"appName","allowed_values":["Fennec"]},
    {"field_name":"appUpdateChannel","allowed_values":["nightly"]},
    {"field_name":"appVersion","allowed_values":"22.0a1"},
    {"field_name":"appBuildID","allowed_values":"*"},
    {"field_name":"submission_date","allowed_values":"*"}]}};
var argv = process.argv;
argv.shift();
argv.shift();
//testFilter = JSON.parse(argv[0]);
//console.log();
function queryForSpecificFiles(url, filter)
{
    request.post(url).set('Content-Type', 'application/json')
        .send(filter)
        .end(function(resp){
            console.log('Response body: ', resp.body);
            files = resp.body.files;
            var getFiles = [];
            for(var i= 0; i < resp.body.length; i++) {
                getFiles.push(resp.body[i][Object.keys(resp.body[i])[0]]);
            }
            console.log("all my files are ", getFiles);
        });
}
queryForSpecificFiles(myFakeServ, testFilter);


