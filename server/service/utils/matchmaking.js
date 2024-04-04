// matchmaking.js

// Tableau en mémoire pour stocker les joueurs en attente de match
const matchmakingQueue = [];

// Fonction pour rejoindre la file d'attente de matchmaking
const joinMatchmakingQueue = (userId) => {
  // Ajoute l'ID du joueur à la file d'attente
  matchmakingQueue.push(userId);
  // Vérifie si une partie peut être créée
  return checkMatchmaking();
};

// Fonction pour vérifier si une partie peut être créée
const checkMatchmaking = () => {
  // Vérifie s'il y a au moins deux joueurs en attente de match
  if (matchmakingQueue.length >= 2) {
    // Extrait les deux premiers joueurs de la file d'attente
    const player1 = matchmakingQueue.shift();
    const player2 = matchmakingQueue.shift();
    // Retourne un tableau contenant les deux joueurs pour créer la partie
    return [player1, player2];
  }

  // Retourne null si une partie ne peut pas être créée pour le moment
  return null;
};

module.exports = { joinMatchmakingQueue };
