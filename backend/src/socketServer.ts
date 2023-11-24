import servers from "./server";
const {io, app} = servers;

io.on("connection", _socket => {
    console.log("Socket server started");
});