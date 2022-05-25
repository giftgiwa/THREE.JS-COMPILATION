import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/RGBELoader.js';

//starter
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = -30;
camera.position.y = 6;

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

const loader = new GLTFLoader();                                                                                        

let ball;
let geometry;

loader.load( './ball.gltf', function ( gltf ) { //load sphere
	gltf.scene.traverse(function(model) {
		if (model.isMesh) {
			model.castShadow = true;
			model.material = sphereMaterial;
			
		}
	});

	ball = gltf.scene
	ball.scale.set(5, 5, 5)
	geometry = ball.geometry
	
	//scene.add( ball )	
}, undefined, function ( error ) {
	console.error( error );
} );


const randomizeMatrix = function () {

	const position = new THREE.Vector3();
	const rotation = new THREE.Euler();
	const quaternion = new THREE.Quaternion();
	const scale = new THREE.Vector3();

	return function ( matrix ) {

		position.x = Math.random() * 40 - 20;
		position.y = Math.random() * 40 - 20;
		position.z = Math.random() * 40 - 20;

		rotation.x = Math.random() * 2 * Math.PI;
		rotation.y = Math.random() * 2 * Math.PI;
		rotation.z = Math.random() * 2 * Math.PI;

		quaternion.setFromEuler( rotation );

		scale.x = scale.y = scale.z = Math.random() * 1;

		matrix.compose( position, quaternion, scale );

	};

}();



const mesh = new THREE.InstancedMesh(geometry, sphereMaterial, 10)
const matrix = new THREE.Matrix4()

for ( let i = 0; i < 10; i ++ ) {

	randomizeMatrix( matrix );
	mesh.setMatrixAt( i, matrix );

}

scene.add(mesh);

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