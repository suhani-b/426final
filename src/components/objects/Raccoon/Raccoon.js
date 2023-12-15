import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './raccoon.glb';

class Raccoon extends Group {
    constructor(parent, player, x0, z0, hp0, speed) {
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
        this.to_random = 0;
        this.random_counter = 0;

        loader.load(MODEL, (gltf) => {
            gltf.scene.scale.multiplyScalar(2);
            gltf.scene.position.x = -8.6
            gltf.scene.position.z = 8.6
            gltf.scene.position.y = 0.5

            this.add(gltf.scene);
        });

        this.hp = hp0;

        this.prev_x = 0;
        this.prev_z = 0;

        this.x_acc = 0;
        this.z_acc = 0;
        this.dt = 0.1;

        this.position.x = x0;
        this.position.z = z0;

        this.speed = speed;
        this.rx = 0;
        this.rz = 0;
        this.reroll = 0.01
        this.randomness = 1;
        this.collision_radius = 0.5;

        this.dead = false;

        this.D = 0.8;
        this.k = 1;
        this.retreat = false;

        this.prev_attack = false;
        this.attack_counter = 0;
    }

    is_attacked() {
        if (this.prev_attack && this.attack_counter < 50) {
            // console.log(this.attack_counter);
            this.attack_counter += 1;
            // console.GLTFLoader
            this.prev_attack = true;
            return true;
        }

        if (!this.player.attack_pressed) {
            this.prev_attack = false;
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
                // console.log("actually hit");
                this.prev_attack = true;
                this.attack_counter = 0;
                return true;
            }
        }

        this.prev_attack = false;
        return false;

    }

    is_attacked_2() {
        if (!this.player.attack2_in_progress) {
            return false;
        }

        let dx = this.position.x - this.player.position.x;
        let dz = this.position.z - this.player.position.z;
        if (Math.sqrt(dx*dx + dz*dz) < this.player.attack2_radius) {
            if (!this.dead) {
                this.scene.num_raccoons -= 1;
            }
            return true;
        }

    }

    update_2(timestamp) {
        if (this.is_attacked_2()) {
            this.dead = true;
        }

        if (Math.random() < this.reroll) {
            this.speed *= (Math.random() + 0.5);
            if (this.speed > 0.05) {
                this.speed = 0.05;
            }
            this.rx = this.randomness * 2 * (Math.random() - 0.5);
            this.rz = this.randomness * 2 * (Math.random() - 0.5);
        }

        // console.log("Raccoon", this.position.x, this.position.z);
        let diff_x = this.player.position.x - this.position.x;
        let diff_z = this.player.position.z - this.position.z;
        if (Math.sqrt(diff_x*diff_x + diff_z*diff_z) < this.collision_radius) {
            this.player.dead = true;
            this.scene.game_over = true;
        }

        // console.log("Acc", this.x_acc, this.z_acc)

        
        let dx = (1 - this.D) * (this.position.x - this.prev_x) + this.x_acc * this.dt * this.dt;
        let dz = (1 - this.D) * (this.position.z - this.prev_z) + this.z_acc * this.dt * this.dt;
        

        if (this.is_attacked() || this.dead) {
            this.speed = 0.02
            this.hp -= 0.01;
            // console.log(this.hp);
            if (this.hp < 0 || this.dead) {
                if (!this.dead) {
                    this.scene.num_raccoons -= 1;
                    this.dead = true;
                }
                this.speed = 0.1;
            }
            this.x_acc = -this.k * diff_x;
            this.z_acc = -this.k * diff_z;
            if (this.retreat) {
                this.rotation.y = Math.atan2(-dz, dx) + this.base_rot;
            }
            else {
                this.rotation.y = Math.atan2(dz, -dx) + this.base_rot;
            }
            this.retreat = true;
        }
        else {
            this.x_acc = this.k * diff_x + this.rx;
            this.z_acc = this.k * diff_z + this.rz;
            if (this.retreat) {
                this.rotation.y = Math.atan2(-dz, dx) + this.base_rot;
            }
            else {
                this.rotation.y = Math.atan2(dz, -dx) + this.base_rot;
            }
            this.retreat = false;
            
        }
        

        if (dx != 0 || dz != 0) {
            let len = Math.sqrt(dx * dx + dz * dz);
            dx = dx/(len);
            dz = dz/(len);
        }


        this.prev_x = this.position.x;
        this.prev_z = this.position.z;
        
        
        this.position.x += dx * this.speed;
        this.position.z += dz * this.speed;

        if (this.dead) {
            this.rotation.y = Math.atan2(dz, -dx) + this.base_rot;
        }

        
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
            let len = Math.sqrt(dx*dx + dz*dz);
            dx = dx/len;
            dz = dz/len;
        }

        // console.log(this.move_random)

        let rand_var = Math.random();
        if (this.move_random && rand_var < this.away_random) {
            this.move_random = false;
        }
        else if (!this.move_random && rand_var < this.to_random) {
            this.move_random = true;
            let rx = 0.1 * (Math.random() - 0.5) + dx;
            let rz = 0.1 * (Math.random() - 0.5) + dz;
            if (rx != 0 || rz != 0) {
                let len = 0;
                this.random_x = rx/len;
                this.random_z = rz/len;
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