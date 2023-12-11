import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './flower.gltf';

class Flower extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // this.z_vel = 0;

        this.angle = -Math.PI/2;

        // Init state
        this.state = {
            gui: parent.state.gui,
            bob: true,
            spin: (() => this.spin()), // or this.spin.bind(this)
            twirl: 0,
        };

        // Load object
        const loader = new GLTFLoader();

        this.name = 'flower';
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });

        // Add self to parent's update list
        parent.addToUpdateList(this);

        // Populate GUI
        this.state.gui.add(this.state, 'bob');
        this.state.gui.add(this.state, 'spin');
    }

    translate(dx, dy) {
        let measure = Math.max(Math.abs(Math.cos(this.angle), Math.abs(Math.sin(this.angle))));

        // let rot_speed = 1 + 0.5 * Math.abs(Math.log(1 - measure));
        // let rot_speed = 0.2/(1 - measure);
        let rot_speed = measure * 5 + 1;
        // let rot_speed = 2;
        this.position.x += dx;
        this.position.z += dy;
        let x = (Math.cos(this.angle) - rot_speed * dx);
        let y = Math.sin(this.angle) + rot_speed * dy;
        if (x != 0 || y != 0) {
            x = x / Math.sqrt(x*x + y*y);
            y = y / Math.sqrt(x*x + y*y);
        }
        this.angle = Math.atan2(y, x);
        // if (x == 0 && y == 0) {
        //     return;
        // }
        // if (x == 0) {
        //     if (y > 0) {
        //         this.angle = Math.PI / 2;
        //     }
        //     else {
        //         this.angle = 3 * Math.PI / 2;
        //     }
        // }
        // else {
        //     let ang = Math.atan(y/x);
        //     if (ang == 0) {
        //         if (x > 0) {
        //             this.angle = Math.PI;
        //         }
        //         else {
        //             this.angle = 0;
        //         }
        //     }
        //     else if (ang > 0 && y > 0) {
        //         this.angle = ang;
        //     }
        //     else if (ang > 0 && y <= 0) {
        //         this.angle = ang + Math.PI;
        //     }
        //     else if (ang <= 0 && y > 0) {
        //         this.angle = ang + Math.PI;
        //     }
        //     else if (ang <= 0 && y <= 0) {
        //         this.angle = ang + 2*Math.PI;
        //     }
        // }
        console.log("Delta", dx, dy);
        console.log("xy", x, y);
        console.log("Angle", this.angle);
        this.rotation.y = this.angle + Math.PI/2;
    }

    spin() {
        // Add a simple twirl
        this.state.twirl += 0;

        // Use timing library for more precice "bounce" animation
        // TweenJS guide: http://learningthreejs.com/blog/2011/08/17/tweenjs-for-smooth-animation/
        // Possible easings: http://sole.github.io/tween.js/examples/03_graphs.html
        const jumpUp = new TWEEN.Tween(this.position)
            .to({ y: this.position.y + 1 }, 300)
            .easing(TWEEN.Easing.Quadratic.Out);
        const fallDown = new TWEEN.Tween(this.position)
            .to({ y: 0 }, 300)
            .easing(TWEEN.Easing.Quadratic.In);

        // Fall down after jumping up
        jumpUp.onComplete(() => fallDown.start());

        // Start animation
        jumpUp.start();
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

        // // Advance tween animations, if any exist
        // TWEEN.update();
        return;

        // console.log(this.position);
    }
}

export default Flower;
