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
            gltf.scene.scale.multiplyScalar(75);
            gltf.scene.position.y = 5;
            gltf.scene.rotateX(Math.PI/2);
            gltf.scene.rotateZ(Math.PI);
            this.add(gltf.scene);
        });
    }
}

export default Bolt;
