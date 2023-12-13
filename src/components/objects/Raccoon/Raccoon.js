import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './raccoon.glb';

class Raccoon extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'raccoon';

        loader.load(MODEL, (gltf) => {
            gltf.scene.scale.multiplyScalar(2);
            gltf.scene.position.x = -5
            gltf.scene.position.z = 5
            gltf.scene.position.y = 1

            this.add(gltf.scene);
        });
    }
}

export default Raccoon;