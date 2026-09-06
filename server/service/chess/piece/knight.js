const Piece = require("./piece.js");

class Knight extends Piece {
  constructor(color, state) {
    super("knight", color, state);
  }
}

module.exports = Knight;
