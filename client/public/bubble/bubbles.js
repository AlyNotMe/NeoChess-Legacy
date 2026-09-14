// Ambient floating bubbles behind the auth cards, ported from the
// Figma source's <Bubbles /> React component (random size/position/
// timing, alternating purple/amber) into plain DOM — this project has
// no client bundler, so it stays a small vanilla script like before.
const body = document.body;
const bubblesDiv = document.createElement("div");
bubblesDiv.id = "bubblesDiv";
body.appendChild(bubblesDiv);

const BUBBLE_COUNT = 28;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

for (let i = 0; i < BUBBLE_COUNT; i++) {
  const el = document.createElement("div");
  const dot = document.createElement("span");
  dot.classList.add("dot");
  el.appendChild(dot);

  const size = randomBetween(28, 72);
  el.classList.add(Math.random() > 0.35 ? "purple" : "amber");
  el.style.left = `${randomBetween(2, 95)}%`;
  el.style.top = `${randomBetween(55, 95)}%`;
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.animationDuration = `${randomBetween(8, 16)}s`;
  el.style.animationDelay = `${randomBetween(0, 12)}s`;

  bubblesDiv.appendChild(el);
}
