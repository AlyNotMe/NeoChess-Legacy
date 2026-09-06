const Piece = require("./piece.js");

class King extends Piece {
  constructor(color, state) {
    super("king", color, state);
  }
}

module.exports = King;
