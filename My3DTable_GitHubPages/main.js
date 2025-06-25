
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
scene.add(light);

const ambient = new THREE.AmbientLight(0x404040);
scene.add(ambient);

const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xf0f0f0 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

const tables = [
  { id: "T1", status: "Reserved", client: "Laura", time: "19:00" },
  { id: "T2", status: "Available" },
  { id: "T3", status: "Occupied", client: "Marc" },
  { id: "T4", status: "Cleaning" },
  { id: "T5", status: "Reserved", client: "Alex", time: "20:00" }
];

const statusColors = {
  Available: 0x00ff00,
  Reserved: 0xff0000,
  Occupied: 0xffff00,
  Cleaning: 0x0000ff
};

tables.forEach((table, index) => {
  const geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32);
  const material = new THREE.MeshStandardMaterial({ color: statusColors[table.status] });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set((index - 2) * 3, 0.1, 0);
  mesh.userData = table;
  scene.add(mesh);
});

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 5, 10);
controls.update();

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  for (let obj of intersects) {
    if (obj.object.userData && obj.object.userData.id) {
      const t = obj.object.userData;
      alert(`Table ${t.id}\nStatus: ${t.status}\nClient: ${t.client || "-"}\nTime: ${t.time || "-"}`);
      break;
    }
  }
}
window.addEventListener('click', onMouseClick);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
