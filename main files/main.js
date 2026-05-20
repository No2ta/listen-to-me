import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );




const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );
const controls = new OrbitControls(camera, renderer.domElement);

const geometry = new THREE.BoxGeometry( 5, 6, 0.2 );
const material = new THREE.MeshStandardMaterial( { color: 'rgb(130, 127, 120)' } );

const pointLight = new THREE.PointLight(0xffffff, 5.0, 0, 1); 
pointLight.position.set(0, 5, 3); 
const pointLight2 = new THREE.PointLight(0xffffff, 5.0, 0, 1); 
pointLight2.position.set(0, 5, -3); 
const pointLight3 = new THREE.PointLight(0xffffff, 5.0, 0, 3); 
pointLight3.position.set(5, 0, 0); 
const pointLight4 = new THREE.PointLight(0xffffff, 5.0, 0, 3); 
pointLight4.position.set(-5, 0, 0); 
const pointLight5 = new THREE.PointLight(0xffffff, 5.0, 0, 3); 
pointLight5.position.set(0, -6, 0); 



scene.add(pointLight);
scene.add(pointLight2);
scene.add(pointLight3);
scene.add(pointLight4);
scene.add(pointLight5);

const cube = new THREE.Mesh( geometry, material );
scene.add( cube );
camera.position.z = 8;

function animate( time ) {
  controls.update();
  renderer.render( scene, camera );
}