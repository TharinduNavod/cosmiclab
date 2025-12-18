const canvas = document.getElementById("slitCanvas");
const ctx = canvas.getContext("2d");

function drawPattern() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for (let x = 0; x < canvas.width; x++) {
    const intensity = Math.sin(x * 0.02) ** 2;
    ctx.fillStyle = `rgba(140,120,255,${intensity})`;
    ctx.fillRect(x, 0, 1, canvas.height);
  }
}

drawPattern();
