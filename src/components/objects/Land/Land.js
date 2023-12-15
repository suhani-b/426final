import { Group, Vector3, ShaderMaterial } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import MODEL from './low_poly_island.glb';
import MODEL from './land.gltf';


class Land extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'land';

        loader.load(MODEL, (gltf) => {
            gltf.scene.scale.multiplyScalar(2.5);
           
            this.add(gltf.scene);
        });

        this.position.y = -1;
    }
}

export default Land;
