import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './bear_trap.glb';

class Trap extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'trap';

        loader.load(MODEL, (gltf) => {
            gltf.scene.scale.multiplyScalar(2);
            gltf.scene.position.y = 2.92;
            this.add(gltf.scene);
        });
    }
}

export default Trap;
