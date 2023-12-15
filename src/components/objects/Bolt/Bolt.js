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
            gltf.scene.position.y = 1;
            gltf.scene.rotateX(Math.PI/2);
            gltf.scene.rotateZ(Math.PI);
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
        console.log(this.counter);
        if (this.collected) {
            return;
        }
        let player = this.scene.fox;
        let dx = player.position.x - this.position.x;
        let dz = player.position.z - this.position.z;
        this.parent.lights.bolt_light.intensity = 5 * (1 - this.counter/this.lifetime);

        if (Math.sqrt(dx*dx + dz*dz) < this.collision_radius) {
            this.position.x += 1000;
            this.position.y += 1000;
            this.position.z += 1000;
            this.scene.num_bolts -= 1;
            player.battery += this.boost;
            if (player.battery > 1) {
                player.battery = 1;
            }
            this.parent.lights.bolt_light.intensity = 0;
            this.collected = true;
        }

        

        if (this.counter > this.lifetime) {
            this.position.x += 1000;
            this.position.y += 1000;
            this.position.z += 1000;
            this.scene.num_bolts -= 1;
            this.parent.lights.bolt_light.intensity = 0;
            this.collected = true;
        }

        this.counter += 1;
        
    }
}

export default Bolt;
