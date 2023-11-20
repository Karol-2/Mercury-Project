import servers from "./server";
const linkSecret = "ijr2iq34rfeiadsfkjq3ew";
const {io, app} = servers;


io.on("connection", socket => {
    console.log("socket");
});