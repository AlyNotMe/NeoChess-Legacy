const {
  Bishop,
  King,
  Knight,
  Pawn,
  Queen,
  Rook,
} = require("./piece/export.js");

const BACK_RANK = [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook];

class Chessboard {
  constructor(room) {
    this.id = room;
    this.board = new Array(8).fill(null).map(() => new Array(8).fill(null));
    this.currentPlayer = "white"; // Initialiser le joueur actif comme Blancs
    this.placeStartingPieces();
  }

  // Méthode pour changer de joueur actif
  togglePlayer() {
    this.currentPlayer = this.currentPlayer === "white" ? "black" : "white";
  }

  placePiece(x, y, piece) {
    this.board[y][x] = piece;
    // console.log(this.board[y][x]);
  }

  placeStartingPieces() {
    this.placeBackRank("white", 7);
    this.placePawns("white", 6);
    this.placeBackRank("black", 0);
    this.placePawns("black", 1);
  }

  placeBackRank(color, y) {
    BACK_RANK.forEach((PieceClass, x) => {
      this.placePiece(x, y, new PieceClass(color, { x, y }));
    });
  }

  placePawns(color, y) {
    for (let x = 0; x < 8; x++) {
      this.placePiece(x, y, new Pawn(color, { x, y }));
    }
  }
  movePiece(fromX, fromY, toX, toY) {
    const piece = this.board[fromY][fromX];
    if (piece && piece.move(toX, toY)) {
      this.board[toY][toX] = piece;
      this.board[fromY][fromX] = null;
      this.togglePlayer(); // Changer de joueur après le coup réussi
      return this; // Le déplacement a réussi
    }
    return false; // Le déplacement est invalide ou aucune pièce n'est présente sur la case de départ
  }
}

module.exports = Chessboard;
