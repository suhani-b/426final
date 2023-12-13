/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene } from 'scenes';

// Initialize core ThreeJS components
const scene = new SeedScene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });

let keys = {'w': 0, 'a': 0, 's': 0, 'd': 0, ' ': 0, 'r': false};
// Set up camera
camera.position.set(0, 10, -10);
camera.lookAt(new Vector3(0, 0, 0));

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Set up controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;
// controls.enablePan = false;
// controls.minDistance = 4;
// controls.maxDistance = 16;
// controls.update();

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    // controls.update();
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp, keys, camera);
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};



const handleKeyUp = (e) => {
    if (e.key == "w" && keys['w'] > 0) {
        keys['w'] = 0;
        // keys['w'] -= 1;
    }
    if (e.key == "a" && keys['a'] > 0) {
        keys['a'] = 0;
        // keys['a'] -= 1;
    }
    if (e.key == "s" && keys['s'] > 0) {
        keys['s'] = 0;
        // keys['s'] -= 1;
    }
    if (e.key == "d" && keys['d'] > 0) {
        keys['d'] = 0;
        // keys['d'] -= 1;
    }
    if (e.key == " ") {
        keys['l'] = 0;
    }
    if (e.key == "r") {
        keys['r'] = false;
    }
    // scene.translate(keys);
    
}

const handleKeyDown = (e) => {
    if (e.key == "w") {
        keys['w'] += 1;
    }
    if (e.key == "a") {
        keys['a'] += 1;
    }
    if (e.key == "s") {
        keys['s'] += 1;
    }
    if (e.key == "d") {
        keys['d'] += 1;
    }
    if (e.key == " ") {
        keys['l'] = true;
    }
    if (e.key == "r") {
        keys['r'] = true;
    }
    // scene.translate(keys);
    
}


windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);
window.addEventListener('keyup', handleKeyUp);
window.addEventListener('keydown', handleKeyDown);