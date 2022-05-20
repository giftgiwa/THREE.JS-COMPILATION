import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/RGBELoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = -60;
camera.position.y = 6;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio * 2);
document.body.appendChild( renderer.domElement );
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

console.log(window.innerWidth, window.innerHeight)

//orbit controls
let controls = new OrbitControls(camera, renderer.domElement)


//HDRI MAP
const hdrEquirect = new RGBELoader().load(
	"./paul_lobe_haus_4k.hdr",  
	() => { hdrEquirect.mapping = THREE.EquirectangularReflectionMapping; }
);

const sphereMaterial = new THREE.MeshPhysicalMaterial({color: 0xdce0e6, 
	metalness:0, opacity:1.0, transmission:1, envMap: hdrEquirect, 
	roughness:0, depthTest: true} )
const equatorMaterial = new THREE.MeshStandardMaterial({color: 0x242526, metalness:1, 
	opacity:0.8, roughness:0.8} )

const loader = new GLTFLoader();
const manager = new THREE.LoadingManager();
let pos_arr = [] // to be filled with positions of spheres

//spheres and equators (WIP)
let ball = new THREE.Mesh();
let equator = new THREE.Mesh()

for (let i = 1; i <= 12; i++) {

	let scale = Math.floor(Math.random() * 3) + 1

	let pos_x = Math.floor(Math.random() * 10) * 5 - 25
	let pos_y = Math.floor(Math.random() * 10) * 5 - 25
	let pos_z = Math.floor(Math.random() * 10) * 5 - 25

	loader.load( './ball.gltf', function ( gltf ) { //load sphere
		gltf.scene.traverse(function(model) {
			if (model.isMesh) {
			model.castShadow = true;
			model.material = sphereMaterial;
			pos_arr.push(model)
			}
		});
		ball = gltf.scene
		ball.position.set(pos_x, pos_y, pos_z)
		ball.scale.set(scale, scale, scale)
		scene.add( ball );
		
	}, undefined, function ( error ) {
		console.error( error );
	} );	

	loader.load( './equator.gltf', function ( gltf2 ) {
		gltf2.scene.traverse(function(model) { //for gltf shadows!
			if (model.isMesh) {
			  model.castShadow = true
			  model.material = equatorMaterial
			}
		});
		equator = gltf2.scene
		equator.position.set(pos_x, pos_y, pos_z)
		equator.scale.set(scale, scale, scale)
		scene.add( equator )
		
	}, undefined, function ( error ) {
		console.error( error )
	} );
	pos_arr.push([ball, equator])
}

console.log(pos_arr[1])

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );



//light
const light = new THREE.AmbientLight( 0xffffff );
scene.add( light );

let period = 5
let clock = new THREE.Clock();
let matrix = new THREE.Matrix4();

//render
function animate() {
	requestAnimationFrame( animate );
	//camera.lookAt(0, 0, 60)
	   //Math.random() * 0.5
	//pos_arr[0][0].position
	//declared once at the top of your code

	var axis = new THREE.Vector3(0,0.5,0);//tilted a bit on x and y - feel free to plug your different axis here
	//in your update/draw function
	

	/*for (let j = 0; j < pos_arr.length; j++) {
		let movement = Math.random() * 0.5
		pos_arr[j][0].position.y += movement
		pos_arr[j][1].position.y += movement
		if (pos_arr[j][0].position.y >= 40) {
			pos_arr[j][0].position.y = -40
			pos_arr[j][0].position.y = -40
		}
	}*/

	//matrix.makeRotationY(clock.getDelta() * 2 * Math.PI / period);
	//camera.position.applyMatrix4(matrix);	
	//camera.lookAt(0, 0, 0);	
	//console.log(equator.rotation)
	
	renderer.render( scene, camera );
}
animate();