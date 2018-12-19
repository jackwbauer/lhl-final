var spawn = require('child_process').spawn;
var http = require("http");
var child = spawn('/opt/vc/bin/raspivid', ['-hf', '-w', '1280', '-h', '1024', '-t', '999999999', '-fps', '20', '-b', '5000000', '-o', '-']);
var server = http.createServer(function (request, response) {
    child.stdout.pipe(response);
});
server.listen(8080);
console.log(child.stdout);
console.log("Server is listening on port 8080");