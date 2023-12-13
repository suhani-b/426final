import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './raccoon.glb';

class Raccoon extends Group {
    constructor(parent, player, x0, z0) {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();
        this.base_rot = -0.8;
        this.name = 'raccoon';
        this.player = player;
        this.scene = parent;

        loader.load(MODEL, (gltf) => {
            gltf.scene.scale.multiplyScalar(2);
            gltf.scene.position.x = -8.6
            gltf.scene.position.z = 8.6
            gltf.scene.position.y = 1

            this.add(gltf.scene);
        });

        this.position.x = x0;
        this.position.z = z0;
        this.speed = 0.03;
        this.collision_radius = 0.5;
    }

    is_attacked() {
        if (!this.player.attack_pressed) {
            return false;
        }
        let x = this.position.x - this.player.position.x;
        let z = this.position.z - this.player.position.z;
        let theta = Math.atan2(z, -x);
        if (theta < 0) {
            theta += 2*Math.PI;
        }
        let light_angle = this.player.angle;
        if (light_angle < 0) {
            light_angle += 2*Math.PI;
        }
        if (light_angle > 2*Math.PI) {
            light_angle -= 2*Math.PI;
        }

        console.log("Theta", theta);
        console.log("Light angle", light_angle);
        let light_width = this.player.light.angle;
        console.log("Light width", light_width);
        console.log("Light distance", this.player.light.distance);
        if (Math.abs(theta - light_angle) < light_width || Math.abs(theta - light_angle - 2*Math.PI) < light_width || Math.abs(theta - light_angle + 2*Math.PI) < light_width) {
            if (Math.sqrt(x*x + z*z) < this.player.light.distance) {
                return true;
            }
        }
        return false;

    }

    update(timestamp) {
        console.log("raccoon update");
        console.log("Player", this.player.position);
        console.log("Raccoon", this.position);
        console.log("Attacked", this.is_attacked());

        let dx = this.player.position.x - this.position.x;
        let dz = this.player.position.z - this.position.z;
        if (Math.sqrt(dx*dx + dz*dz) < this.collision_radius) {
            this.player.dead = true;
            this.scene.game_over = true;
        }
        if (dx != 0 || dz != 0) {
            dx = dx/(Math.sqrt(dx*dx + dz*dz));
            dz = dz/(Math.sqrt(dx*dx + dz*dz));
        }

        

        this.rotation.y = Math.atan2(dz, -dx) + this.base_rot;

        console.log("vec", dx, dz);

        if (this.is_attacked()) {
            dx = -dx;
            dz = -dz;
            this.speed = 0.02;
        }
        this.position.x += this.speed * (dx);
        this.position.z += this.speed * (dz);
        
    }
}

export default Raccoon;