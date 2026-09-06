class Piece {
  constructor(name, color, state) {
    this.piece = name;
    this.color = color;
    this.state = state;
    this.direction = color === "white" ? -1 : 1;
  }

  /**
   * Contrat commun à toutes les pièces.
   * @param {number} newX
   * @param {number} newY
   * @returns {boolean} true si le déplacement est valide et a été appliqué
   */
  move(newX, newY) {
    return false; // pas encore implémenté par défaut
  }
}

module.exports = Piece;
