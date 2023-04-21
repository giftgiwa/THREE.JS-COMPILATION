import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js'

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 15;
camera.position.y = 10;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
// renderer.setPixelRatio( window.devicePixelRatio * 2);
document.body.appendChild( renderer.domElement );
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );

let controls = new OrbitControls(camera, renderer.domElement)
controls.maxPolarAngle = Math.PI/2 - 0.1; 

const loader = new GLTFLoader();
let crown = new THREE.Mesh();
loader.load( './BLENDERCROWN.gltf', function ( gltf ) {
	gltf.scene.traverse(function(model) { //for gltf shadows!
		if (model.isMesh) {
		  model.castShadow = true;
		}
	});
	crown = gltf.scene;
	crown.receiveShadow = true;
	crown.castShadow = true;
    scene.add( crown );
}, undefined, function ( error ) {
	console.error( error );
} );

const plane = new THREE.Mesh( new THREE.PlaneGeometry(10000, 10000), new THREE.MeshLambertMaterial( {color: 0xf0f0f0} ) );
plane.castShadow = true;
plane.receiveShadow = true
plane.rotation.x=THREE.Math.degToRad(-90)
// scene.add( plane );

let light = new THREE.DirectionalLight( 0xffffff ); //light
light.position.set( 7,7,7);
light.castShadow = true
light.receiveShadow = true
scene.add(light);
light.shadow.mapSize.width = 4096;
light.shadow.mapSize.height = 4096;

const d = 30;
light.shadow.camera.left = - d;
light.shadow.camera.right = d;
light.shadow.camera.top = d;
light.shadow.camera.bottom = - d;

const hemiLight = new THREE.HemisphereLight( 0x828282, 0x444444 );
hemiLight.position.set( 0, 20, 0 );
scene.add( hemiLight );

function animate() { //render
	requestAnimationFrame( animate );
	crown.rotation.y+=0.06
	// crown.rotation.x+=0.03
	// crown.rotation.z+=0.03
	renderer.render( scene, camera );
}
animate();
