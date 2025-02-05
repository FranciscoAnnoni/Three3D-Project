import './style.css';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from "gsap";


// Creando la escena
const scene = new THREE.Scene();

// Creando la cámara
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.set(10, 10, 10);

// // HELPERS
// const size = 10;
// const divisions = 10;

// const gridHelper = new THREE.GridHelper( size, divisions );
// scene.add( gridHelper );

// const axesHelper = new THREE.AxesHelper( size );
// scene.add( axesHelper );

//Cargando imagen de fondo
const loaderTexture = new THREE.TextureLoader();
const backgroundTexture = loaderTexture.load(''); // Cambia por tu imagen
scene.background = backgroundTexture;

// Renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;  // Habilitar sombras
document.body.appendChild(renderer.domElement);

// Controles de órbita
 const controls = new OrbitControls(camera, renderer.domElement);
 controls.enableDamping = true;

// Agregando luces
// 🔆 Luz Ambiental (Luz tenue en toda la escena)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// 🔦 Luz Direccional (Fuente de luz principal)
const directionalLight = new THREE.DirectionalLight(0xffaa00, 10);
directionalLight.position.set(-150, -10, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// // 🔍 Helper para ver hacia dónde apunta la luz direccional
// const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight, 2);
// scene.add(dirLightHelper);


// // 🎥 Cámara de sombras para ver el área iluminada
// const shadowCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(shadowCameraHelper);


// Configuración de sombras
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;

// Cargando modelo 3D
const loader = new GLTFLoader();
let ship;

loader.load('./interstellar/scene.gltf', function (gltf) {
  ship = gltf.scene;
  ship.traverse((node) => {
      if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
          if (node.material.map) {
              node.material.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
              node.material.map.needsUpdate = true;
          }
      }
  });
  ship.scale.set(0.1,0.1,0.1)
  scene.add(ship);
});

// renderiza automaticamente a este formato
renderer.setPixelRatio(3);


// Variables para controlar el estado del clic y la rotación
let isHolding = false;
let startTime = 0;
let endTime = 0;
let shouldRotate = true; // Controla si el cubo debe rotar



// Evento cuando se presiona el clic
document.addEventListener("pointerdown", () => {
  if (ship) {
    gsap.to(ship.position, { x: "5", y: "5", z: "5", duration: 0.5, ease: "power2.out" });
}

    if (!isHolding) {
        startTime = performance.now();
        isHolding = true;
        shouldRotate = false; // Detiene la rotación    
    }
camera.lookAt(5,5,5);

});


// Evento cuando se suelta el clic
document.addEventListener("pointerup", () => {
  if (ship) {
    gsap.to(ship.position, { x: "0.1", y: "0.1", z: "0.1", duration: 0.5, ease: "power2.out" });
}
    if (isHolding) {
        endTime = performance.now();
        let elapsedTime = ((endTime - startTime) / 1000).toFixed(2); // Tiempo en segundos
        console.log(`Mantuviste el click por ${elapsedTime} segundos`);

        isHolding = false;
        shouldRotate = true; // Reanuda la rotación
    }

    camera.lookAt(0,0,0);

});



// Animación
function animate() {
    controls.update();
    
    if(ship){
      if (shouldRotate) {
        // camera.position.x = 100;
        // camera.position.z = 30;
        // camera.position.y = 0;
      ship.rotation.x += 0.01; // Velocidad de rotación
      } 
    }
    renderer.render(scene, camera);
}

// Iniciar la animación
renderer.setAnimationLoop(animate);



// // Creando la escena (la escena en si)
// const scene = new THREE.Scene();
// // Creando la camara (como lo vemos o el punto de vista)
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// // Es  cuando se renderiza.
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);





// //Cuadrado rotativo en 3d

// // Agregamos el render al DOM
// document.body.appendChild(renderer.domElement);

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// camera.position.z = 5;

// // Controles de órbita
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true; // Suaviza el movimiento del mouse

// // Variables para controlar el estado del clic y la rotación
// let isHolding = false;
// let startTime = 0;
// let endTime = 0;
// let shouldRotate = true; // Controla si el cubo debe rotar

// // Evento cuando se presiona el clic
// document.addEventListener("pointerdown", () => {
//   cube.scale.x -=2.2;
//   cube.scale.y -=2.2;
//   cube.scale.z -=2.2;

//     if (!isHolding) {
//         startTime = performance.now();
//         isHolding = true;
//         shouldRotate = false; // Detiene la rotación
        
//     }
// });

// // Evento cuando se suelta el clic
// document.addEventListener("pointerup", () => {
//   cube.scale.x +=2.2;
//   cube.scale.y +=2.2;
//   cube.scale.z +=2.2;

//     if (isHolding) {
//         endTime = performance.now();
//         let elapsedTime = ((endTime - startTime) / 1000).toFixed(2); // Tiempo en segundos
//         console.log(`Mantuviste el click por ${elapsedTime} segundos`);

//         isHolding = false;
//         shouldRotate = true; // Reanuda la rotación
//     }
// });

// // Animación
// function animate() {
//     controls.update();

//     if (shouldRotate) {
//         cube.rotation.x += 0.0001;
//         cube.rotation.y += 0.005;
//     }

//     renderer.render(scene, camera);
// }

// // Iniciar la animación
// renderer.setAnimationLoop(animate);
