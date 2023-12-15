import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
// import MODEL from '../Raccoon/low_poly_raccoon_procyon_lotor/scene.gltf';
import MODEL from './low_poly_fox.glb';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

class Fox extends Group {
    constructor(parent) {
        // Call parent Group() constructor

        super();
        this.dead = false;
        this.attack_pressed = false;
        this.prev_attack2 = false;
        this.attack2_pressed = false;
        this.attack2_in_progress = false;
        this.attack2_radius = 0;
        this.attack2_counter = 0;
        this.num_syringes = 0;

        this.battery = 1;

        // this.z_vel = 0;
        this.scene = parent;
        this.light = parent.lights.player_light;
        // light constants
        this.light.decay = 2;
        this.light.penumbra = 0;
        this.light.intensity = 0;

        this.angle = -Math.PI/2 + 0.001;

        // Init state
        // this.state = {
        //     gui: parent.state.gui,
        //     bob: true,
        //     spin: (() => this.spin()), // or this.spin.bind(this)
        //     twirl: 0,
        // };

        const loader = new GLTFLoader();
        console.log("LOADING", MODEL);

        this.name = 'flower';
        loader.load(MODEL, (gltf) => {
            console.log("LOADING GLTF", gltf, gltf.scene)
            gltf.scene.scale.multiplyScalar(1.5);
            gltf.scene.position.y = 1;
            gltf.scene.rotateY(Math.PI);
            this.add(gltf.scene);
        });

        // Add self to parent's update list
        // parent.addToUpdateList(this);

        // Populate GUI
        // this.state.gui.add(this.state, 'bob');
        // this.state.gui.add(this.state, 'spin');
    }

    translate(dx, dy) {
        if (dx == 0 && dy == 0) {
            return;
        }


        if (this.dead) {
            return;
        }

        let measure = Math.max(Math.abs(Math.cos(this.angle), Math.abs(Math.sin(this.angle))));

        // let rot_speed = 1 + 0.5 * Math.abs(Math.log(1 - measure));
        // let rot_speed = 0.2/(1 - measure);
        let rot_speed = measure * 3 + 1;
        rot_speed *= 0.3;
        // let rot_speed = 2;
        let new_x = this.position.x + dx;
        let new_z = this.position.z + dy;
        if (Math.sqrt(new_x * new_x + new_z * new_z) > this.scene.stage_radius - 1) {
            return;
        }
        this.position.x += dx;
        this.position.z += dy;
        let x = (Math.cos(this.angle) - rot_speed * dx);
        let y = Math.sin(this.angle) + rot_speed * dy;
        if (x != 0 || y != 0) {
            let len = Math.sqrt(x*x + y*y);
            x = x / len;
            y = y / len;
        }
        this.angle = Math.atan2(y, x);
        // console.log("Delta", dx, dy);
        // console.log("xy", x, y);
        // console.log("Angle", this.angle);
        this.rotation.y = this.angle + Math.PI/2;
        
    }

    // spin() {
    //     // Add a simple twirl
    //     // this.state.twirl += 0;

    //     // Use timing library for more precice "bounce" animation
    //     // TweenJS guide: http://learningthreejs.com/blog/2011/08/17/tweenjs-for-smooth-animation/
    //     // Possible easings: http://sole.github.io/tween.js/examples/03_graphs.html
    //     const jumpUp = new TWEEN.Tween(this.position)
    //         .to({ y: this.position.y + 1 }, 300)
    //         .easing(TWEEN.Easing.Quadratic.Out);
    //     const fallDown = new TWEEN.Tween(this.position)
    //         .to({ y: 0 }, 300)
    //         .easing(TWEEN.Easing.Quadratic.In);

    //     // Fall down after jumping up
    //     jumpUp.onComplete(() => fallDown.start());

    //     // Start animation
    //     jumpUp.start();
    // }

    attack_pressed() {
        this.attack_pressed = true;
    }

    update(timeStamp) {
        // if (this.state.bob) {
        //     // Bob back and forth
        //     this.rotation.z = 0.05 * Math.sin(timeStamp / 300);
        // }
        // if (this.state.twirl > 0) {
        //     // Lazy implementation of twirl
        //     this.state.twirl -= Math.PI / 8;
        //     this.rotation.y += Math.PI / 8;
        // }
        // + Math.PI/2
        // // Advance tween animations, if any exist
        // TWEEN.update();
        // console.log(this.attack_pressed)
        let attack_light = this.scene.lights.attack_light;
        attack_light.position.x = this.position.x;
        attack_light.position.z = this.position.z;
        attack_light.position.y = this.position.y + 6;
        // console.log(attack_light.position);
        attack_light.target.position.x = this.position.x;
        attack_light.target.position.z = this.position.z;
        attack_light.target.position.y = this.position.y;
        // console.log(attack_light.position, attack_light.target.position);

        if (this.attack_pressed) {
            this.light.intensity = 100;
            this.light.angle = this.battery * 0.8;
            this.light.distance = this.battery * 10;
    
            if (this.battery > 0) {
                // takes T seconds to decrease fully
                let T = 20;
                this.battery -= 0.01 * 1/T;
            }
            else {
                this.battery = 0;
            }
        }
        else {
            this.light.intensity = 0;
        }

        if (!this.attack2_in_progress && this.attack2_pressed && !this.prev_attack2) {
            if (this.num_syringes > 0) {
                this.attack2_in_progress = true;
                this.attack2_counter = 0;
                this.num_syringes -= 1;
            }
            
        }

        let T = 25;
        if (this.attack2_in_progress) {
            // console.log(this.scene.lights);

            this.attack2_radius = 1 + 4 * this.attack2_counter/T;

            attack_light.position.y = this.position.y + this.attack2_radius;
            attack_light.intensity = 20 * Math.pow(this.attack2_counter/T, 2);
            this.attack2_counter += 1;
        }

        if (this.attack2_counter > T) {
            this.attack2_in_progress = false;
            this.scene.lights.attack_light.intensity = 0;
        }





        
        
        this.prev_attack2 = this.attack2_pressed;
        return;

        // console.log(this.position);
    }
}

export default Fox;
