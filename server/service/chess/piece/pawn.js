const Piece = require("./piece.js");

class Pawn extends Piece {
  constructor(color, state) {
    super("pawn", color, state);
    this.alreadyMoved = false;
  }

  move(newX, newY) {
    const { x, y } = this.state;

    if (this.isValidMove(x, y, newX, newY)) {
      this.state = { x: newX, y: newY };
      this.alreadyMoved = true;
      return true;
    }
    return false;
  }

  isValidMove(currentX, currentY, newX, newY) {
    const dx = newX - currentX;
    const dy = (newY - currentY) * this.direction;

    const isForwardOneStep = dx === 0 && dy === 1;
    const isForwardTwoSteps = dx === 0 && dy === 2 && !this.alreadyMoved;
    const isDiagonalCapture = Math.abs(dx) === 1 && dy === 1;

    return isForwardOneStep || isForwardTwoSteps || isDiagonalCapture;
  }
}

module.exports = Pawn;
