const socket = io("/matchmaking");
const play = document.querySelector("#play");
console.log(play);

play.addEventListener("click", () => {
  socket.emit("matchmaking");
});

socket.on("matchmaking", (data) => {
  switch (data.error) {
    case "AlreadyInQueue":
      alert("you are already in queue");
      break;
  }
});

socket.on("matchFound", (data) => {
  alert("match");
  console.log(data);
});

/**
 * je dois faire un service pour créer une game dans la db au lieu d'une route utilisateur
 * demander a chat gpt
 */
