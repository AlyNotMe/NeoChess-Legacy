const { Server } = require("socket.io");
const Chessboard = require("../chess/gameState.js");
const { GameUser } = require("../database/index.js");
const games = []; // Tableau pour stocker les instances de l'état du jeu

/**
 * Determines which color a user should play in a game: reuses their
 * existing color if they already joined this game before (reconnect),
 * otherwise assigns white to the first joiner and black to the second.
 * @param {number} idGame
 * @param {number} idUser
 * @returns {Promise<"white"|"black">}
 */
async function assignColor(idGame, idUser) {
  const existing = await GameUser.findOne({ where: { idGame, idUser } });
  if (existing) return existing.dataValues.color;

  const playerCount = await GameUser.count({ where: { idGame } });
  return playerCount === 0 ? "white" : "black";
}

/**
 * Fonction pour gérer la logique du jeu en utilisant les WebSockets
 * @param {Server} io Instance du serveur Socket.IO
 * @param {import("express-session").RequestHandler} sessionMiddleware
 */
const gameSocket = (io, sessionMiddleware) => {
  const gameSocket = io.of("/game"); // Crée un espace de noms pour les jeux

  // Attache la session à chaque connexion de ce namespace (un middleware
  // global io.use() ne s'applique qu'au namespace par défaut "/").
  gameSocket.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res || {}, next);
  });

  // Rejette toute connexion sans utilisateur authentifié.
  gameSocket.use((socket, next) => {
    if (!socket.request.session?.user) {
      next(new Error("unauthorized"));
      return;
    }
    next();
  });

  // Écoute les connexions des clients
  gameSocket.on("connection", (socket) => {
    // Événement pour rejoindre une salle de jeu
    socket.on("join-room", async (room) => {
      // Vérifie si la salle de jeu existe déjà dans le tableau game
      const alreadyExist = games.find((el) => el.id === room);
      if (!alreadyExist) {
        // Si la salle de jeu n'existe pas, crée une nouvelle instance d'état du jeu
        const board = new Chessboard(room);
        games.push(board); // Ajoute l'instance d'état du jeu au tableau game
      }

      // Récupère l'état du jeu correspondant à la salle de jeu
      const state = games.find((el) => el.id === room);
      socket.join(room); // Fait rejoindre le client à la salle de jeu

      // Vérifie le nombre de joueurs dans la salle de jeu
      const size = gameSocket.adapter.rooms.get(room).size;
      if (size === 2) {
        state.started = true; // Si deux joueurs sont présents, marque le jeu comme commencé
      }
      gameSocket.to(room).emit("game-start", !!state.started); // Envoie un signal pour indiquer que le jeu a commencé

      const idUser = socket.request.session.user.id;
      const color = await assignColor(state.id, idUser);
      const [gameUser] = await GameUser.findOrCreate({
        where: { idGame: state.id, idUser },
        defaults: {
          idGame: state.id,
          idUser,
          color,
        },
      });

      // Mémorise la room et la couleur jouée sur ce socket, pour valider
      // les coups reçus dans playMove sans re-consulter la DB à chaque fois.
      socket.data.room = room;
      socket.data.color = gameUser.dataValues.color;

      // Prépare les données du jeu à envoyer au client
      const gameData = {
        gameId: state.id,
        user: socket.request.session.user,
        color: gameUser.dataValues.color,
        state,
      };

      socket.emit("join-room", gameData); // Envoie les données du jeu au client
    });

    // Événement pour jouer un coup
    socket.on("playMove", (room, c, n) => {
      // Trouve l'état du jeu correspondant à la salle de jeu
      const state = games.find((el) => el.id === room);
      if (!state) {
        socket.emit("moveRejected", { reason: "unknownRoom" });
        return;
      }
      if (socket.data.room !== room) {
        socket.emit("moveRejected", { reason: "notInRoom" });
        return;
      }
      if (state.currentPlayer !== socket.data.color) {
        socket.emit("moveRejected", { reason: "notYourTurn" });
        return;
      }
      const piece = state.board[c.y]?.[c.x];
      if (!piece || piece.color !== socket.data.color) {
        socket.emit("moveRejected", { reason: "notYourPiece" });
        return;
      }

      // Exécute le déplacement sur le plateau d'échecs et récupère le nouvel état du jeu
      const gameState = state.movePiece(c.x, c.y, n.x, n.y);
      if (!gameState) {
        socket.emit("moveRejected", { reason: "invalidMove" });
        return;
      }
      // Envoie le nouvel état du jeu à tous les clients dans la salle de jeu
      gameSocket.to(room).emit("update-state", gameState);
    });
  });
};

module.exports = gameSocket; // Exporte la fonction gameSocket pour être utilisée ailleurs dans l'application
