const http = require("http");
const nodeapp = require("../Components/nodeapp");
const port = process.env.PORT || 3000;

const server = http.createServer(nodeapp);

server.listen(port);
