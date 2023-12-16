/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3, AudioListener, Audio, AudioLoader } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene } from 'scenes'
import * as THREE from 'three';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader.js';
import SOUND from './sounds/sound-effects-library-spooky-ambience.mp3';


function initScreen() {
    const startScreen = document.createElement('div');
    startScreen.style.position = 'absolute';
    startScreen.style.top = '15vh'; // Adjust the position as needed
    startScreen.style.left = '32vw'; // Adjust the position as needed
    startScreen.style.height = '500px';
    startScreen.style.width = '600px';
    startScreen.style.padding = '30px';
    startScreen.style.background = 'rgba(117, 46, 156, 0.95)';
    startScreen.style.fontFamily = 'Monospace, Monaco';
    startScreen.style.fontSize = "30px";
    startScreen.style.color = '#fff';
    startScreen.style.textAlign = 'center';
    startScreen.style.visibility = 'hidden';
    startScreen.innerHTML = 
    "<h2>Rabid Raccoons</h2>" +
    "<hr>" +
    "<p style='font-size: 16px'>Hi Mr.Fox! You have been on top of the Princeton campus foodchain for many years. <br><br>" +
    "But lately a new species has been challenging your presence, the campus is under a Raccoon invasion. " +
    "It's upto you to take the throne back, save this school, and establish yourself as the king Fox of Princeton again.</p>" + 
    "<p style='font-size: 16px; text-align: left;'><u>How to play: </u><br>" +
    "1. Move around using w, a, s, d <br>" +
    "2. Spacebar to use flashlight to scare away raccoons. Your torch battery dies down, collect battery around the map. <br>" +
    "3. Collect shockwave vaccines and press l to repel all raccoons around you</p>";

    document.body.appendChild(startScreen);

    return startScreen;
}
function initEnd() {
    const endScreen = document.createElement('div');
    endScreen.style.position = 'absolute';
    endScreen.style.top = '15vh'; // Adjust the position as needed
    endScreen.style.left = '32vw'; // Adjust the position as needed
    endScreen.style.height = '500px';
    endScreen.style.width = '600px';
    endScreen.style.padding = '20px';
    endScreen.style.background = 'rgba(117, 46, 156, 0.95)';
    endScreen.style.fontFamily = 'Monospace, Monaco';
    endScreen.style.fontSize = "30px";
    endScreen.style.color = '#fff';
    endScreen.style.textAlign = 'center';
    endScreen.style.visibility = 'hidden';
    endScreen.style.display = 'flex';
    endScreen.style.justifyContent = 'center';
    endScreen.style.alignItems = 'center';

    document.body.appendChild(endScreen);

    return endScreen;
}

function initTimer() {
    const timerElement = document.createElement('div');
    timerElement.id = 'timer'; // Set an ID for styling
    timerElement.style.position = 'absolute';
    timerElement.style.top = '20px'; // Adjust the position as needed
    timerElement.style.left = '20px'; // Adjust the position as needed
    timerElement.style.padding = '10px';
    timerElement.style.background = '#000';
    timerElement.style.border = '0.5px solid #fff';
    timerElement.style.fontFamily = 'Arial, sans-serif';
    timerElement.style.color = '#fff';

    // Append the timer element to the document body
    document.body.appendChild(timerElement);

    return timerElement;
}

function initBattery() {
    const batteryElement = document.createElement('div');
    batteryElement.id = 'battery'; // Set an ID for styling
    batteryElement.style.position = 'absolute';
    batteryElement.style.marginTop = '50px';
    batteryElement.style.top = '20px'; // Adjust the position as needed
    batteryElement.style.left = '20px'; // Adjust the position as needed
    batteryElement.style.padding = '10px';
    batteryElement.style.background = '#000';
    batteryElement.style.border = '0.5px solid #fff';
    batteryElement.style.fontFamily = 'Arial, sans-serif';
    batteryElement.style.color = '#fff';

    // Append the timer element to the document body
    document.body.appendChild(batteryElement);

    return batteryElement;
}

function initSyringes() {
    const syringeCounter = document.createElement('div');
    syringeCounter.id = 'syringe'; // Set an ID for styling
    syringeCounter.style.position = 'absolute';
    syringeCounter.style.marginTop = '100px';
    syringeCounter.style.top = '20px'; // Adjust the position as needed
    syringeCounter.style.left = '20px'; // Adjust the position as needed
    syringeCounter.style.padding = '10px';
    syringeCounter.style.background = '#000';
    syringeCounter.style.border = '0.5px solid #fff';
    syringeCounter.style.fontFamily = 'Arial, sans-serif';
    syringeCounter.style.color = '#fff';

    // Append the timer element to the document body
    document.body.appendChild(syringeCounter);

    return syringeCounter;
}


const timerElement = initTimer();
const batteryElement = initBattery();
const startScreen = initScreen()
const endScreen = initEnd();
const syringeCounter = initSyringes();

// Initialize core ThreeJS components
const scene = new SeedScene(timerElement, batteryElement, startScreen, endScreen, syringeCounter);
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });

let keys = {'w': 0, 'a': 0, 's': 0, 'd': 0, ' ': 0, 'r': false, 'k': false};
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

// ********* AUDIO ************ //


// ****************************** //

// create an AudioListener and add it to the camera
// const listener = new THREE.AudioListener();
// camera.add( listener );

// // create a global audio source
// const sound = new THREE.Audio( listener );

// // load a sound and set it as the Audio object's buffer
// const audioLoader = new THREE.AudioLoader();
// audioLoader.load(SOUND, function( buffer ) {
//     console.log("HUH");
// 	sound.setBuffer( buffer );
// 	sound.setLoop( true );
// 	sound.setVolume( 100 );
// 	sound.play();
// });

// sound.play();

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    // controls.update();
    // sound.play();
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp, keys, camera, timerElement);
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
        keys[' '] = 0;
    }
    if (e.key == "l") {
        keys['l'] = false;
    }
    if (e.key == "r") {
        keys['r'] = false;
    }
    // if (e.key == "k") {
    //     keys['k'] = false;
    // }
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
        keys[' '] = true;
    }
    if (e.key == "r") {
        keys['r'] = true;
    }
    if (e.key == "l") {
        keys['l'] = true;
    }
    if (e.key == "k") {
        keys['k'] = true;
    }
    // scene.translate(keys);
    
}


windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);
window.addEventListener('keyup', handleKeyUp);
window.addEventListener('keydown', handleKeyDown);
