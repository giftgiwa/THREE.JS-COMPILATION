import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/RGBELoader.js';

//starter
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.01, 1000 );
camera.position.set(0, 0, 5)

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
//renderer.setPixelRatio( window.devicePixelRatio * 2);
document.body.appendChild( renderer.domElement );
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//orbit controls
let controls = new OrbitControls(camera, renderer.domElement)

//HDRI MAP
const hdrEquirect = new RGBELoader().load(
	"./paul_lobe_haus_4k.hdr",  
	() => { hdrEquirect.mapping = THREE.EquirectangularReflectionMapping; }
);

//materials
const sphereMaterial = new THREE.MeshPhysicalMaterial({color: 0xdce0e6, 
	metalness:0, opacity:1.0, transmission:1, envMap: hdrEquirect, 
	roughness:0, depthTest: true} )
const equatorMaterial = new THREE.MeshStandardMaterial({color: 0x242526, metalness:1, 
	opacity:0.8, roughness:0.8} )


//const geometry = new THREE.SphereGeometry(10, 64, 64)






//light
const light = new THREE.AmbientLight( 0xffffff );
scene.add( light );

//render
function animate() {
	requestAnimationFrame( animate );
	//camera.lookAt(0, 0, 60)
	
	/*for (let j = 0; j < all.length; j++) {
		let rot_x = Math.random() * 0.00005 - 0.2
		let rot_z = Math.random() * 0.00005 - 0.2
		let movement = Math.random() * 0.2
		all[j][0].position.y += movement

		all[j][1].rotation.x += rot_x
		all[j][1].rotation.z += rot_z
		all[j][1].rotation.y += 0.05
		all[j][1].position.y += movement

		if (all[j][0].position.y >= 50) {
			all[j][0].position.y = -50
			all[j][1].position.y = -50
		}
	}*/

	//matrix.makeRotationY(clock.getDelta() * 2 * Math.PI / period);
	//camera.position.applyMatrix4(matrix);	
	//camera.lookAt(0, 0, 0);	
	//console.log(equator.rotation)
	
	renderer.render( scene, camera );
}
animate()