import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'jsm/loaders/GLTFLoader.js';

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(earthGroup);

new OrbitControls(camera, renderer.domElement);

const loader = new THREE.TextureLoader();
const dayTexture = loader.load("./textures/00_earthmap1k.jpg");

const geometry = new THREE.IcosahedronGeometry(1, 12);
const material = new THREE.MeshPhongMaterial({
    map: dayTexture,
    emissive: 0x000000,
    shininess: 0
});

const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

// Ajustar a iluminação
const sunLight = new THREE.DirectionalLight(0xffffff, 6.0);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

// Adicionar fundo de estrelas
const starTexture = loader.load("./textures/stars/stars.jpg");
const starGeometry = new THREE.SphereGeometry(100, 64, 64);
const starMaterial = new THREE.MeshBasicMaterial({
    map: starTexture,
    side: THREE.BackSide
});
const starField = new THREE.Mesh(starGeometry, starMaterial);
scene.add(starField);

// Adicionar o Sol
const sunTexture = loader.load("./textures/sol.jpg");
const sunGeometry = new THREE.SphereGeometry(1.5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
sunMesh.position.set(-40, 0, 0);
scene.add(sunMesh);

// Adicionar a Lua
const moonTexture = loader.load("./textures/lua.jpg");
const moonGeometry = new THREE.SphereGeometry(0.27, 32, 32);
const moonMaterial = new THREE.MeshPhongMaterial({ map: moonTexture });
const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
moonMesh.position.set(-10, 0, 0);
scene.add(moonMesh);

const moonOrbitRadius = 8;
let moonOrbitAngle = 0;

// Adicionar a Segunda Lua
const secondMoonTexture = loader.load("./textures/lua2.jpg");
const secondMoonGeometry = new THREE.SphereGeometry(0.18, 32, 32);
const secondMoonMaterial = new THREE.MeshPhongMaterial({ map: secondMoonTexture });
const secondMoonMesh = new THREE.Mesh(secondMoonGeometry, secondMoonMaterial);
secondMoonMesh.position.set(-10, 0, 0);
scene.add(secondMoonMesh);

const secondMoonOrbitRadius = 12;
let secondMoonOrbitAngle = 0;

// Loader para carregar o satélite em formato .gltf
const gltfLoader = new GLTFLoader();
const satellites = [];
const satelliteOrbitData = [];

gltfLoader.load('./models/satellite.gltf', function (gltf) {
    const satelliteMesh = gltf.scene;
    satelliteMesh.scale.set(0.02, 0.02, 0.02);

    for (let i = 0; i < 150; i++) {
        const clone = satelliteMesh.clone();
        const radius = Math.random() * 5 + 2;
        const angle = Math.random() * Math.PI * 2;

        clone.position.set(
            Math.cos(angle) * radius,
            Math.random() * 2 - 1,
            Math.sin(angle) * radius
        );

        clone.rotation.y = Math.random() * Math.PI * 2;
        scene.add(clone);
        satellites.push(clone);

        satelliteOrbitData.push({
            radius: radius,
            angle: angle,
            speed: Math.random() * 0.001 + 0.001
        });

        clone.userData = { satellite: clone };
    }
});

// Função para detectar o clique no objeto 3D
function onDocumentMouseDown(event) {
    event.preventDefault();

    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(satellites, true);
    if (intersects.length > 0) {
        const satellite = intersects[0].object;
        openModal(satellite);
    }
}
document.addEventListener('mousedown', onDocumentMouseDown, false);

// Função para abrir o modal com informações do satélite
// Seleciona a div onde os cards vão aparecer

// Função para buscar e criar os cards
function fetchAndDisplaySatellites() {
    // Usa fetch para obter o arquivo JSON
    fetch('index.json') // Altere para o caminho correto do seu arquivo JSON
        .then(response => {
            // Verifica se a resposta foi bem-sucedida
            if (!response.ok) {
                throw new Error('Erro ao carregar os dados');
            }
            return response.json();
        })
        .then(satellites => {
            // Para cada satélite, cria um card
            satellites.forEach(satellite => {
                const card = document.createElement('div');
                card.classList.add('satellite-card');

                // Adiciona as informações do satélite no card
                card.innerHTML = `
                    <div class="card-satelite" onclick="openModal(${JSON.stringify(satellite)})">
                      <img src="./textures/photo-satelite.png" alt="Satellite Icon" class="satellite-icon">
                        <div class="satellite-info">
                            <h3>${satellite.OBJECT_NAME}</h3>
                            <p><strong>ID:</strong> ${satellite.OBJECT_ID}</p>
                            <p><strong>Posição:</strong> (${satellite.position.x.toFixed(2)}, ${satellite.position.y.toFixed(2)}, ${satellite.position.z.toFixed(2)})</p>
                        </div>
                    </div>
                `;

                // Adiciona o card ao container
                satellitesDiv.appendChild(card);
            });
        })
        .catch(error => console.error('Erro ao carregar os satélites:', error));
}

// Função para abrir o modal com as informações do satélite
function openModal(satellite) {
    const modal = document.getElementById('satelliteModal');
    modal.style.display = 'block';
    modal.style.opacity = '1';

    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
    <h2>Informações do Satélite</h2>
    <p><strong>Nome:</strong> ${satellite.OBJECT_NAME}</p>
    <p><strong>ID:</strong> ${satellite.OBJECT_ID}</p>
    <p><strong>Posição do satélite:</strong> 
    (${satellite.position.x.toFixed(2)}, 
    ${satellite.position.y.toFixed(2)}, 
    ${satellite.position.z.toFixed(2)})
    </p>
    <button id="closeButton">Fechar</button>
`;
    const closeButton = document.getElementById('closeButton');
    closeButton.addEventListener('click', closeModal);
}

// Função para fechar o modal
function closeModal() {
    const modal = document.getElementById('satelliteModal');
    modal.style.display = 'none';
    modal.style.opacity = '0';
}

// Chama a função para buscar e exibir os satélites
fetchAndDisplaySatellites();


// Adiciona o modal ao HTML
const modalHTML = `
<div id="satelliteModal" style="display:none; position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:white; padding:20px; box-shadow: 0 2px 10px rgba(0,0,0,0.5); transition: opacity 0.5s; opacity: 1;">
  <div id="modalContent"></div>
</div>
`;
document.body.insertAdjacentHTML('beforeend', modalHTML);

// Função de animação
function animate() {
    requestAnimationFrame(animate);

    earthMesh.rotation.y += 0.002;

    satellites.forEach((satellite, index) => {
        const orbitData = satelliteOrbitData[index];
        orbitData.angle += orbitData.speed;

        satellite.position.set(
            Math.cos(orbitData.angle) * orbitData.radius,
            satellite.position.y,
            Math.sin(orbitData.angle) * orbitData.radius
        );
    });

    moonOrbitAngle += 0.01;
    moonMesh.position.set(
        Math.cos(moonOrbitAngle) * moonOrbitRadius,
        0,
        Math.sin(moonOrbitAngle) * moonOrbitRadius
    );

    secondMoonOrbitAngle += 0.008;
    secondMoonMesh.position.set(
        Math.cos(secondMoonOrbitAngle) * secondMoonOrbitRadius,
        0,
        Math.sin(secondMoonOrbitAngle) * secondMoonOrbitRadius
    );

    renderer.render(scene, camera);
}
animate();
