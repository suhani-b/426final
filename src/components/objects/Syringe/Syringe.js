import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './syringe.glb';

class Syringe extends Group {
    constructor(parent, x0, z0) {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'syringe';

        loader.load(MODEL, (gltf) => {
            gltf.scene.scale.multiplyScalar(0.01);
            gltf.scene.position.y = 1;
            gltf.scene.position.x = 0;
            gltf.scene.rotateY(Math.PI/2);
            gltf.scene.rotateX(Math.PI/2);
            this.add(gltf.scene);
        });

        this.scene = parent;
        this.position.x = x0;
        this.position.z = z0;
        this.collision_radius = 0.5;
    }

    update() {
        let player = this.scene.flower;
        let dx = player.position.x - this.position.x;
        let dz = player.position.z - this.position.z;
        if (Math.sqrt(dx*dx + dz*dz) < this.collision_radius) {
            this.position.x += 1000;
            this.position.y += 1000;
            this.position.z += 1000;
            this.scene.num_syringes -= 1;
            player.num_syringes += 1;
        }
        
    }
}

export default Syringe;
