const scale = document.getElementById("scale");
const text = document.getElementById("scaleText");

const stages = [
  "Quantum Foam",
  "Atom",
  "Human",
  "Earth",
  "Sun",
  "Galaxy",
  "Black Hole"
];

scale.oninput = () => {
  text.innerHTML = stages[Math.floor(scale.value / 15)];
};
