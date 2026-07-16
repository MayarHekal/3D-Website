import * as THREE from 'three';
import './style.css';
import {ParametricGeometry} from 'three/examples/jsm/geometries/ParametricGeometry.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({canvas: document.querySelector('#bg'), alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

const ambientlight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientlight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 8, 5);
scene.add(directionalLight);


function mobiusStripMath(u, t, target) {
	u *= Math.PI;
	t *= 2 * Math.PI;
	u = u * 2;
	const phi = u / 2;
	const major = 2.25, a = 0.125, b = 0.65;
	let x = a * Math.cos(t) * Math.cos(phi) - b * Math.sin(t) * Math.sin(phi);
	const z = a * Math.cos(t) * Math.sin(phi) + b * Math.sin(t) * Math.cos(phi);
	const y = (major + x) * Math.sin(u);
	x = (major + x) * Math.cos(u);
	target.set(x, y, z);
}

const geo = new ParametricGeometry(mobiusStripMath, 150, 80);
const tex = new THREE.TextureLoader();
const grid = tex.load('grid.png');
grid.wrapS = THREE.RepeatWrapping;
grid.wrapT = THREE.RepeatWrapping;
grid.repeat.set(8, 4);
const mat = new THREE.MeshStandardMaterial({
  map: grid,
  roughness: 0.3,
  metalness: 0.7,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.85
});
const mobiusstrip = new THREE.Mesh(geo, mat);
scene.add(mobiusstrip);
camera.position.z = 8;


function klein(v, u, target) {
	u *= Math.PI;
	v *= 2 * Math.PI;
	u = u * 2;
	let x, z;

	if (u < Math.PI) {
		x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(u) * Math.cos(v);
		z = - 8 * Math.sin(u) - 2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v);
	} else {
		x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(v + Math.PI);
		z = - 8 * Math.sin(u);
	}

	const y = - 2 * (1 - Math.cos(u) / 2) * Math.sin(v);
	target.set(x, y, z);
}

const geometry = new ParametricGeometry(klein, 150, 80);
const texture = new THREE.TextureLoader().load('grid4.png')
const material = new THREE.MeshStandardMaterial({
	map: grid,
	roughness: 0.3,
	metalness: 0.7,
	side: THREE.DoubleSide,
	transparent: true,
	opacity: 0.85
});
const kleinbottle = new THREE.Mesh(geometry, material);
scene.add(kleinbottle);
kleinbottle.scale.set(0.3, 0.3, 0.3);
camera.position.z = 8;


let pyramid;
function mksphere() {
	const pyramidgeo = new THREE.SphereGeometry(1);
	const spheretex = new THREE.TextureLoader().load('grid3.png')
	const pyramidmat = new THREE.MeshBasicMaterial({map: pyramidtex});
	pyramid = new THREE.Mesh(pyramidgeo, pyramidmat);
	pyramid.scale.set(0.1, 0.1, 0.1);
	scene.add(pyramid);
}


const mouse = new THREE.Vector2();
window.addEventListener('mousemove', (event) => {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});
const targetPosition = new THREE.Vector3();

function animate() {
	requestAnimationFrame(animate);
	if (mobiusstrip) {
        mobiusstrip.rotation.x += 0.01;
        mobiusstrip.rotation.y += 0.01;
    }
    if (kleinbottle) {
        kleinbottle.rotation.x += 0.01;
        kleinbottle.rotation.y += 0.01;
    }
	if (pyramid) {
		targetPosition.set(mouse.x * 6.5, mouse.y * 3.5, 5);
        pyramid.position.lerp(targetPosition, 0.05);
        pyramid.rotation.x += 0.01;
        pyramid.rotation.y += 0.01;
    }
	renderer.render( scene, camera );
}

animate();


function moveCamera() {
	const t = document.body.getBoundingClientRect().top;
	const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
	const scrollPercent = maxScroll > 0 ? Math.abs(t) / maxScroll : 0;
	const startY = 3.5; 
	const endY = -3.5;
	const targetX = 12;
	const scrollOffset = t * 0.019;
	if (pyramid) {
		pyramid.rotation.y = (t * -0.002) + (Math.PI / 4);
	}
	mobiusstrip.position.y = 0 - scrollOffset;
	kleinbottle.position.y = -13 - scrollOffset; 
	mobiusstrip.rotation.y = t * -0.002;
	kleinbottle.rotation.y = t * -0.002;
}

window.addEventListener('scroll', moveCamera);
moveCamera();