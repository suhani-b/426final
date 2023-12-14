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
        this.move_random = false;
        this.random_x = 0;
        this.random_z = 0;
        this.to_random = 0.01;
        this.random_counter = 0;

        loader.load(MODEL, (gltf) => {
            gltf.scene.scale.multiplyScalar(2);
            gltf.scene.position.x = -8.6
            gltf.scene.position.z = 8.6
            gltf.scene.position.y = 5

            this.add(gltf.scene);
        });

        this.position.x = x0;
        this.position.z = z0;
        this.speed = 0.03;
        this.randomness = 0;
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

        // console.log("Theta", theta);
        // console.log("Light angle", light_angle);
        let light_width = this.player.light.angle + 0.1;
        // console.log("Light width", light_width);
        // console.log("Light distance", this.player.light.distance);
        if (Math.abs(theta - light_angle) < light_width || Math.abs(theta - light_angle - 2*Math.PI) < light_width || Math.abs(theta - light_angle + 2*Math.PI) < light_width) {
            if (Math.sqrt(x*x + z*z) < this.player.light.distance) {
                return true;
            }
        }
        return false;

    }

    update(timestamp) {
        // console.log("raccoon update");
        // console.log("Player", this.player.position);
        // console.log("Raccoon", this.position);
        // console.log("Attacked", this.is_attacked());
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

        let rand_var = Math.random();
        if (this.move_random && rand_var < this.away_random) {
            this.move_random = false;
        }
        else if (!this.move_random && rand_var < this.to_random) {
            this.move_random = true;
            let rx = 0.1 * (Math.random() - 0.5) + dx;
            let rz = 0.1 * (Math.random() - 0.5) + dz;
            if (rx != 0 || rz != 0) {
                this.random_x = rx/(Math.sqrt(rx*rx + rz*rz));
                this.random_z = rz/(Math.sqrt(rx*rx + rz*rz));
            }
        }

        if (this.is_attacked()) {
            dx = -dx;
            dz = -dz;
            this.speed = 0.02;
            // this.rotation.y = -Math.atan2(dz, -dx) + this.base_rot;
            this.position.x += this.speed * (dx);
            this.position.z += this.speed * (dz);
            return;
        }
        if (this.move_random) {
            this.rotation.y = Math.atan2(this.random_z, -this.random_x) + this.base_rot;
            this.position.x += this.speed * (this.random_x);
            this.position.z += this.speed * (this.random_z);
            return;
        }

        this.rotation.y = Math.atan2(dz, -dx) + this.base_rot;
        this.position.x += this.speed * (dx);
        this.position.z += this.speed * (dz);
        
    }
}

export default Raccoon;