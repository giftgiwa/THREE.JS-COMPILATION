import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/RGBELoader.js';
import mathjs from 'https://cdn.skypack.dev/mathjs';


const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 15;
camera.position.y = 4;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio * 2);
document.body.appendChild( renderer.domElement );
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );

let controls = new OrbitControls(camera, renderer.domElement)
//controls.maxPolarAngle = Math.PI/2 - 0.1;

const hdrEquirect = new RGBELoader().load(
	"./paul_lobe_haus_4k.hdr",  
	() => { hdrEquirect.mapping = THREE.EquirectangularReflectionMapping; }
  );

const sphereMaterial = new THREE.MeshPhysicalMaterial({color: 0xdce0e6, metalness:0, opacity:1.0, transmission:1, envMap: hdrEquirect, roughness:0} )
const equatorMaterial = new THREE.MeshStandardMaterial({color: 0x242526, metalness:1, opacity:0.8, roughness:0.8} )

const loader = new GLTFLoader();
//let ball = new THREE.InstancedMesh({count: 3});

loader.load( './ball.gltf', function ( gltf ) {
	gltf.scene.traverse(function(model) { //for gltf shadows!
		if (model.isMesh) {
		  model.castShadow = true;
		  model.material = sphereMaterial;
		}
	});
	
	let ball = new THREE.InstancedMesh(gltf, sphereMaterial, 10)
	

	
	
}, undefined, function ( error ) {
	console.error( error );
} );


let equator = new THREE.Mesh()
loader.load( './equator.gltf', function ( gltf ) {
	gltf.scene.traverse(function(model) { //for gltf shadows!
		if (model.isMesh) {
		  model.castShadow = true;
		  model.material = equatorMaterial;
		}
	});
	equator = gltf.scene;
    scene.add( equator );
}, undefined, function ( error ) {
	console.error( error );
} );

const light = new THREE.AmbientLight( 0xffffff );
scene.add( light );

function animate() { //render
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();