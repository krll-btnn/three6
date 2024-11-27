import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Сцена
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFEF6EB);

// Камера
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
camera.position.set(0, 50, 200);

// Отрисовщик
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

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

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Плавность вращения

// 3D-модель
const loader = new GLTFLoader();
let mixer; // Mixer для анимаций

loader.load('low-poly_truck_car_drifter.glb', (gltf) => {
  const model = gltf.scene;
  model.scale.set(0.2, 0.2, 0.2);
  scene.add(model);

  // Создаем AnimationMixer для управления анимацией
  mixer = new THREE.AnimationMixer(model);

  // Запускаем анимацию
  const idleClip = gltf.animations.find((clip) => clip.name === 'Car engine');
  if (idleClip) {
    const action = mixer.clipAction(idleClip);
    action.play();
  }
});

// Анимационный цикл
function animate() {
  requestAnimationFrame(animate);

  if (mixer) {
    mixer.update(0.01);
  }

  controls.update();

  renderer.render(scene, camera);
}

animate();