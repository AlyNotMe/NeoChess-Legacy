const Piece = require("./piece.js");

class Queen extends Piece {
  constructor(color, state) {
    super("queen", color, state);
  }
}

module.exports = Queen;
