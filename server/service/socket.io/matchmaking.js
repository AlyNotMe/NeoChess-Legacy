const { Server } = require("socket.io");
const { joinMatchmakingQueue } = require("../utils/matchmaking.js");

const playerSockets = {};

/**
 * Fonction pour gérer le matchmaking du jeu en utilisant les WebSockets
 * @param {Server} io Instance du serveur Socket.IO
 */
const matchmakingSocket = (io, sessionMiddleware) => {
  const matchmakingSocket = io.of("/matchmaking");

  matchmakingSocket.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res || {}, next);
  });

  matchmakingSocket.on("connection", (socket) => {
    socket.on("matchmaking", async () => {
      const userId = socket.request.session.user.id;
      playerSockets[userId] = { socket, session: socket.request.session };
      const match = joinMatchmakingQueue(userId);
      if (match === 0) {
        playerSockets[userId].socket.emit("matchmaking", { error: "AlreadyInQueue" });
        return;
      }
      if (match) {
        // créer la game et envoyer le lien pour les 2 joueurs
        console.log(match);
        const [player1, player2] = match;
        const p1 = playerSockets[player1];
        const p2 = playerSockets[player2];

        p1.socket.emit("matchFound", { opponent: p2.session.user });
        p2.socket.emit("matchFound", { opponent: p1.session.user });
      }
    });
  });
};

module.exports = matchmakingSocket;
