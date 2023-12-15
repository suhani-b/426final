import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './low-poly_grass.glb';

class Grass extends Group {
    constructor(x, y, z) {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'pinetree';

        loader.load(MODEL, (gltf) => {
            gltf.scene.scale.multiplyScalar(2.2);
            gltf.scene.position.x = x
            gltf.scene.position.y = y
            gltf.scene.position.z = z

            this.add(gltf.scene);
        });
    }
}

export default Grass;