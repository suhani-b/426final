import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './lightning.glb';

class Bolt extends Group {
    constructor(parent, x0, z0) {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'bolt';
        this.boost = 0.1;

        loader.load(MODEL, (gltf) => {
            gltf.scene.scale.multiplyScalar(80);
            gltf.scene.position.y = 5;
            gltf.scene.rotateX(Math.PI/2);
            gltf.scene.rotateZ(Math.PI);
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
            this.scene.num_bolts -= 1;
            player.battery += this.boost;
            if (player.battery > 1) {
                player.battery = 1;
            }
        }
        
    }
}

export default Bolt;
