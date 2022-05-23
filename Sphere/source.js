import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
//import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/RGBELoader.js';

//starter
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = -60;
camera.position.y = 6;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
//renderer.setPixelRatio( window.devicePixelRatio * 2);
document.body.appendChild( renderer.domElement );
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//orbit controls
//let controls = new OrbitControls(camera, renderer.domElement)

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

const manager = new THREE.LoadingManager(); //loading manager
const loader = new GLTFLoader(manager);
                                                                                                                  
let all = [...Array(12)].map(e => Array(2).fill(new THREE.Mesh())) //array of spheres/equators
console.log(all)

let test_geometry;

let positions = [] 

for (let i = 0; i < 1 /*temporary*/; i++) {
	
	let scale = Math.floor(Math.random() * 3) + 1
	let pos_x = Math.floor(Math.random() * 9) * 5 - 25
	let pos_y = Math.floor(Math.random() * 9) * 5 - 25
	let pos_z = Math.floor(Math.random() * 9) * 5 - 25

	loader.load( './ball.gltf', function ( gltf ) { //load sphere
		gltf.scene.traverse(function(model) {
			if (model.isMesh) {
				model.castShadow = true;
				//model.material = sphereMaterial;
				geometry = model.geometry
			}
		});

		let pos = new THREE.Vector3(pos_x, pos_y, pos_z)
		positions.push(pos.distanceTo(new THREE.Vector3(0, pos.y , 0))) //log of distances between meshes and y-axis

		all[i][0] = gltf.scene
		all[i][0].position.set(pos_x, pos_y, pos_z)
		all[i][0].scale.set(scale, scale, scale)

		scene.add( all[i][0] )	
	}, undefined, function ( error ) {
		console.error( error );
	} );

	loader.load( './equator.gltf', function ( gltf ) { //load sphere
		gltf.scene.traverse(function(model) {
			if (model.isMesh) {
			model.castShadow = true;
			model.material = equatorMaterial;
			}
		});
		
		all[i][1] = gltf.scene
		all[i][1].position.set(pos_x, pos_y, pos_z)
		all[i][1].scale.set(scale, scale, scale)

		scene.add( all[i][1] )	
	}, undefined, function ( error ) {
		console.error( error );
	} );
}

//light
const light = new THREE.AmbientLight( 0xffffff );
scene.add( light );


//console.log(y_axis_dist)


//render
function animate() {
	requestAnimationFrame( animate );
	//camera.lookAt(0, 0, 60)
	for (let j = 0; j < all.length; j++) {
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
	}
	//matrix.makeRotationY(clock.getDelta() * 2 * Math.PI / period);
	//camera.position.applyMatrix4(matrix);	
	//camera.lookAt(0, 0, 0);	
	//console.log(equator.rotation)
	
	renderer.render( scene, camera );
}
animate()