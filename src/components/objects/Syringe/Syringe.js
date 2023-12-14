import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './syringe.glb';

class Syringe extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'syringe';

        loader.load(MODEL, (gltf) => {
            gltf.scene.scale.multiplyScalar(0.01);
            gltf.scene.position.y = 5;
            gltf.scene.position.x = -3;
            gltf.scene.rotateY(Math.PI/2);
            gltf.scene.rotateX(Math.PI/2);
            this.add(gltf.scene);
        });
    }
}

export default Syringe;
