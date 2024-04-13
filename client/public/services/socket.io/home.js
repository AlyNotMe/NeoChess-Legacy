const socket = io("/home");
const play = document.querySelector("#play");
console.log(play);

play.addEventListener("click", () => {
  socket.emit("matchmaking");
});
