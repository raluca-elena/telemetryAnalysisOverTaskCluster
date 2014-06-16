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
request
  .post('http://ec2-54-203-209-235.us-west-2.compute.amazonaws.com:8080/files')
  .set('Content-Type', 'application/json')
  .send({"filter":{"version":1,"dimensions":[
    {"field_name":"reason","allowed_values":["saved-session"]},
    {"field_name":"appName","allowed_values":["Fennec"]},
    {"field_name":"appUpdateChannel","allowed_values":["nightly"]},
    {"field_name":"appVersion","allowed_values":"22.0a1"},
    {"field_name":"appBuildID","allowed_values":"*"},
    {"field_name":"submission_date","allowed_values":"*"}]}})
  .end(function(resp){
    console.log('Response body: ', resp.body);
    files = resp.body.files;
  });
