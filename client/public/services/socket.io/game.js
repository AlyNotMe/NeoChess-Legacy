const socket = io("/game");
const gameId = document.querySelector("input[name=gameId]").value;

function set(game) {
  (Game.Game = game.board), (Game.currentPlayer = game.currentPlayer);
  Game.render();
}

socket.emit("join-room", gameId);

socket.on("join-room", (game) => {
  console.log(game);
  set(game);
});

// socket.on("game-start", (isStart) => {
//   if (isStart) Game.start();
// });

// const playMove = (current, final) => {
//   socket.emit("playMove", dataGame.gameId, current, final);
// };

// socket.on("update-state", (game) => {
//   console.log(game);
//   set(game);
// });
