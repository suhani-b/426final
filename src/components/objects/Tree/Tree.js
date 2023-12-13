import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './tree.glb';

class Raccoon extends Group {
    constructor(x, y, z) {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'tree';

        loader.load(MODEL, (gltf) => {
            gltf.scene.scale.multiplyScalar(0.01);
            gltf.scene.position.x = x
            gltf.scene.position.y = y
            gltf.scene.position.z = z

            this.add(gltf.scene);
        });
    }
}

export default Raccoon;