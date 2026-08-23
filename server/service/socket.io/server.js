const { Server } = require("socket.io");
const gameSocket = require("./gameSocket.js");
const matchmakingSocket = require("./matchmaking.js");
const sessionMiddleware = require("../../configuration.js");

const runner = (server) => {
  const io = new Server(server, {});
  io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res || {}, next);
  });

  io.on("connection", (socket) => {
    console.log(`New connection`);
  });

  /**
   * game socket
   */
  gameSocket(io);

  matchmakingSocket(io, sessionMiddleware);
};

module.exports = runner;
