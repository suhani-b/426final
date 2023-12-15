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
        this.collision_radius = 2;
        this.lifetime = 500;
        this.counter = 0;
        this.collected = false;
    }

    update() {
        // console.log(this.counter);
        if (this.collected) {
            return;
        }
        let player = this.scene.fox;
        let dx = player.position.x - this.position.x;
        let dz = player.position.z - this.position.z;
        this.parent.lights.syringe_light.intensity = 5 * (1 - this.counter/this.lifetime);
        if (Math.sqrt(dx*dx + dz*dz) < this.collision_radius) {
            this.position.x += 1000;
            this.position.y += 1000;
            this.position.z += 1000;
            this.scene.num_syringes -= 1;
            player.num_syringes += 1;
            this.parent.lights.syringe_light.intensity = 0;
            this.collected = true;
        }

        if (this.counter > this.lifetime) {
            this.position.x += 1000;
            this.position.y += 1000;
            this.position.z += 1000;
            this.scene.num_syringes -= 1;
            this.parent.lights.syringe_light.intensity = 0;
            this.collected = true;
        }
        this.counter += 1;
        
    }
}

export default Syringe;
