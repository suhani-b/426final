import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './lightning.glb';

class Bolt extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'bolt';

        loader.load(MODEL, (gltf) => {
            gltf.scene.scale.multiplyScalar(50);
            gltf.scene.position.y = 5;
            this.add(gltf.scene);
        });
    }
}

export default Bolt;
