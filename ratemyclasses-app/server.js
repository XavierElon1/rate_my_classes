const express = require("express");
// const favicon = require("express-favicon");
const path = require("path");
const server = express();

const PORT = process.env.PORT || 8080;

// server.use(favicon(__dirname + "/build/favicon.ico"));
// the __dirname is the current directory from where the script is running
server.use(express.static(__dirname + "/public"));
// server.use(express.static(path.join(__dirname, "build")));

server.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./platform.html"));
});

server.listen(PORT, () => {
  console.log("\n\n" + "-".repeat(20));
  console.log(new Date().toLocaleString());
  console.log(`Listening on port ${PORT}\n\n`);
});
