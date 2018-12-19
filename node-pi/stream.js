var spawn = require('child_process').spawn;
var http = require("http");
var child = spawn('/opt/vc/bin/raspivid', ['-hf', '-w', '1920', '-h', '1080', '-t', '0', '-fps', '60', '-b', '5000000', '-o', '-']);
var server = http.createServer(function (request, response) {
    child.stdout.pipe(response);
});
server.listen(8080);
//let stream = setInterval(()=>console.log(child.stdout), 3000);
console.log("Server is listening on port 8080");
