var request = require('superagent');
var url = 'http://google.com';
request.get(url, function(response){
 //console.log('Response ok:', response.ok);
 // console.log('Response text:', response.text);
});
var req = request.get(url);
req.end(function(resp){
  //console.log('Got response', resp.text);
});

var files;
var myRealServ = "http://ec2-54-185-133-18.us-west-2.compute.amazonaws.com:8080/files";
var myFakeServ = "http://localhost:8080/files";
request
  .post(myFakeServ)
  .set('Content-Type', 'application/json')
  .send({"filter":{"version":1,"dimensions":[
  //  {"field_name":"reason","allowed_values":["saved-session"]},
  //  {"field_name":"appName","allowed_values":["Fennec"]},
    {"field_name":"appUpdateChannel","allowed_values":["nightly"]},
    {"field_name":"appVersion","allowed_values":"22.0a1"},
    {"field_name":"appBuildID","allowed_values":"*"},
    {"field_name":"submission_date","allowed_values":"*"}]}})
  .end(function(resp){
    console.log('Response body: ', resp.body);
    files = resp.body.files;
  });

var dbUrl = 'http://ec2-54-203-209-235.us-west-2.compute.amazonaws.com:8080/files';
var testFilter = {"filter":{"version":1,"dimensions":[
  {"field_name":"reason","allowed_values":["saved-session"]},
  {"field_name":"appName","allowed_values":["Fennec"]},
  //{"field_name":"appName","allowed_values":["*"]},
  {"field_name":"appUpdateChannel","allowed_values":["nightly"]},
  {"field_name":"appVersion","allowed_values":"22.0a1"},
  {"field_name":"appVersion","allowed_values":"*"},
  {"field_name":"appBuildID","allowed_values":"*"},
  {"field_name":"submission_date","allowed_values":"*"}]}};

function queryForSpecificFiles(url, filter)
{
    request.post(url).set('Content-Type', 'application/json')
           .send(filter)
           .end(function(resp){
                console.log('Response body: ', resp.body);
                files = resp.body.files;
            });
}

//queryForSpecificFiles(dbUrl, testFilter);

process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});
