const { Server } = require("socket.io");
const Chessboard = require("../chess/gameState.js");
const games = []; // Tableau pour stocker les instances de l'état du jeu

/**
 * Fonction pour gérer la logique du jeu en utilisant les WebSockets
 * @param {Server} io Instance du serveur Socket.IO
 */
const gameSocket = (io) => {
  const gameSocket = io.of("/game"); // Crée un espace de noms pour les jeux

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

      // Récupère les informations sur l'utilisateur à partir de la base de données
      const { GameUser } = require("../database/index.js");

      const idUser = socket.request.session.user.id
      const gameUser = await GameUser.findOrCreate({
        where: { idGame: state.id, idUser },
        defaults: {
          idGame: state.id,
          idUser,
          color: "black",
        },
      });

      // Prépare les données du jeu à envoyer au client
      const gameData = {
        gameId: state.id,
        user: socket.request.session.user,
        color: gameUser[0].dataValues.color,
        state,
      };

      socket.emit("join-room", gameData); // Envoie les données du jeu au client
    });

    // Événement pour jouer un coup
    socket.on("playMove", (room, c, n) => {
      // Trouve l'état du jeu correspondant à la salle de jeu
      const state = games.find((el) => el.id === room);
      console.log(room, c, n);
      // Exécute le déplacement sur le plateau d'échecs et récupère le nouvel état du jeu
      const gameState = state.movePiece(c.x, c.y, n.x, n.y);
      // Envoie le nouvel état du jeu à tous les clients dans la salle de jeu
      gameSocket.to(room).emit("update-state", gameState);
    });
  });
};

module.exports = gameSocket; // Exporte la fonction gameSocket pour être utilisée ailleurs dans l'application
