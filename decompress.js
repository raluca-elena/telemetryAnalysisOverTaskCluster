var fs = require('fs');
var lzma = require('lzma').LZMA();
var r = "saved_session-Fennec-nightly-22.0a1-20130227030925.20131101.v2.log.cc03cd521ba84613808daf1e0d6d3ab6.lzma";

fs.readFile(r , function (err,data) {
  if (err) {
    return console.log(err);
  }
  lzma.decompress(data, function(d){
    var data2 =new Buffer(d).toString('utf8');
    console.log("data2 is", data2);
    fs.writeFile(r.substr(0, r.length-5), data2);
  }, function() {console.log("fff");});
 });