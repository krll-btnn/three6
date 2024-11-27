import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Сцена
const scene = new THREE.Scene();

// Отрисовщик
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xFEF6EB);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Камера
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 50, 200);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 100;
controls.maxDistance = 200;
controls.minPolarAngle = 1;
controls.maxPolarAngle = 10;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

// Освещение 
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 50, 30);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.radius = 4;
scene.add(directionalLight);

// Автомобиль
const loader = new GLTFLoader();
let mixer;

loader.load('low-poly_truck_car_drifter.glb', (gltf) => {
  const model = gltf.scene;
  model.scale.set(0.2, 0.2, 0.2);
  model.castShadow = true;
  scene.add(model);

  mixer = new THREE.AnimationMixer(model);

  const idleClip = gltf.animations.find((clip) => clip.name === 'Car engine');
  if (idleClip) {
    const action = mixer.clipAction(idleClip);
    action.play();
  }
});

// Анимация
function animate() {
  requestAnimationFrame(animate);

  if (mixer) {
    mixer.update(0.01);
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();