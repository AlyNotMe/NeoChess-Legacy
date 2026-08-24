const Piece = require("./piece.js");

class Rook extends Piece {
  constructor(color, state) {
    super("rook", color, state);
  }
}

module.exports = Rook;
