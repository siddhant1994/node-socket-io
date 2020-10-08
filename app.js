var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var request = require("request");

let PORT = process.env.PORT || 3000;
server.listen(PORT);

app.use(express.static("public"));

app.get("/ping", function (req, res) {
    return res.send("pong");
});

io.on("connection", function (socket) {
    socket.on("user:join", (obj) => {
        socket.userName = obj.userName;
        io.emit("user:connected", obj);
    });

    socket.on("user:message", (obj) => {
        socket.broadcast.emit("user:message", obj);
    });

    socket.on("disconnect", () => {
        io.emit("user:disconnect", socket.userName);
    });
});
