const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("bhCanvas"), alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);

const geometry = new THREE.SphereGeometry(1, 64, 64);
const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
const blackHole = new THREE.Mesh(geometry, material);

scene.add(blackHole);
camera.position.z = 3;

function animate() {
  requestAnimationFrame(animate);
  blackHole.rotation.y += 0.003;
  renderer.render(scene, camera);
}
animate();
