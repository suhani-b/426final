import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from '../Flower/flower.gltf';

class Raccoon extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'raccoon';

        loader.load(MODEL, (gltf) => {
            gltf.scene.scale.multiplyScalar(2000)
            this.add(gltf.scene);
        });
    }
}

export default Raccoon;