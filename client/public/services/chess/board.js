class board {
  static board;
  static color
  static cg_board = document.querySelector("cg-board");

  static createBoard() {
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const currentPiece = this.board[y][x];
        console.log(currentPiece);
      }
    }
  }
}

export default board;
