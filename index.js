const express = require("express");
const server = express();
const port = 3001;

// Serve static files from the 'public' directory
server.use(express.static('public_html'));

server.get("/", function (req, res) {
    res.send('<p>Welcome to the IMI server! Visit <a href="/hello">/hello</a> for a greeting.</p>');
});

server.get("/hello", function (req, res) {
    res.send("Hello IMIs!");
});

server.listen(port, function () {
    console.log("Express listening on " + port);
});