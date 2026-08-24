const Piece = require("./piece.js");

class Bishop extends Piece {
  constructor(color, state) {
    super("bishop", color, state);
  }
}

module.exports = Bishop;
