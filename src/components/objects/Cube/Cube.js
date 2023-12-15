import { Group, Vector3, ShaderMaterial } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import MODEL from './low_poly_island.glb';
import MODEL from './land.gltf';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader.js';
// import { TextureLoader } from 'three/examples/jsm/loaders/TextureLoader.js';
import TGA from './Stone_Base_Color.tga';
import JPG from './texture.jpg';
import PNG from './forest_floor.png';
import * as THREE from 'three';


class Cube extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new TGALoader();

        // Load the TGA texture
        loader.load(TGA, (texture) => {
            const material = new THREE.MeshStandardMaterial({ map: texture });

            // Create a geometry and mesh (cube in this example)
            const geometry = new THREE.BoxGeometry(100, 100, 100);
            // console.log("scene", scene);
            let cube = new THREE.Mesh(geometry, material);
            this.add(cube);
        });

        // const loader = new THREE.TextureLoader();

        // // Load the TGA texture
        // loader.load(JPG, (texture) => {
        //     const material = new THREE.MeshStandardMaterial({ map: texture });

        //     // Create a geometry and mesh (cube in this example)
        //     const geometry = new THREE.BoxGeometry(100, 100, 100);
        //     // console.log("scene", scene);
        //     let cube = new THREE.Mesh(geometry, material);
        //     this.add(cube);
        // });

        // const loader = new GLTFLoader();

        // this.name = 'land';

        // loader.load(MODEL, (gltf) => {
        //     gltf.scene.scale.multiplyScalar(2.5);
           
        //     this.add(gltf.scene);
        // });

        // this.position.y = -1;
    }
}

export default Cube;
