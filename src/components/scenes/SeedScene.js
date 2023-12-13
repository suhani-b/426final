import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Flower, Land, Raccoon, Tree, Bolt } from 'objects';
import { BasicLights } from 'lights';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AmbientLight } from 'three';

class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            updateList: [],
        };

        // Set background to a nice color
        this.background = new Color(0x230140);
        const ambient_light = new AmbientLight('white', 0.5);
        this.add(ambient_light)
        this.lights = new BasicLights();

        // Add meshes to scene
        this.land = new Land();
        this.flower = new Flower(this);
        this.bolt = new Bolt();
        // this.flower.scale.multiplyScalar(200);
        // this.fl = new Flower(this);
        this.tree_1 = new Tree(-2.5, 2.5, 9);
        this.tree_2 = new Tree(-5, 2.5, 7.5);
        this.tree_3 = new Tree(-8, 2.5, 6);
        this.tree_4 = new Tree(-10.2, 2.5, 4);
        this.tree_5 = new Tree(-11, 2.5, 1);
        this.tree_6 = new Tree(-12, 2.5, -1);
        this.tree_7 = new Tree(-2, 2.5, 5);
        this.tree_8 = new Tree(-2, 2.5, 5);
        // this.tree.position.y = 5;
        this.raccoon = new Raccoon();
        

        this.add(this.land, this.flower,
            this.lights, this.raccoon, this.bolt,
            this.tree_1, this.tree_2,
            this.tree_3, this.tree_4,
            this.tree_5, this.tree_6,
            this.tree_7, this.tree_8);

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp, keys, camera) {
        console.log(timeStamp);
        let camera_pos = this.flower.position.clone();
        camera_pos.x = camera_pos.x + 5*Math.cos(this.flower.angle);
        camera_pos.y = camera_pos.y + 2;
        camera_pos.z = camera_pos.z - 5*Math.sin(this.flower.angle);
        // camera.position.set(camera_pos)
        console.log("Cam", camera_pos);
        console.log("Flow", this.flower.position);
        camera.lookAt(this.flower.position);
        const { rotationSpeed, updateList } = this.state;
        // this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }

        // console.log(this.lights.player_light);
        this.lights.player_light.position.x = this.flower.position.x;
        this.lights.player_light.position.y = this.flower.position.y + 0.8;
        this.lights.player_light.position.z = this.flower.position.z;
        this.lights.player_light.target.position.x = this.flower.position.x - 10*Math.cos(this.flower.angle);
        this.lights.player_light.target.position.y = this.flower.position.y + 0;
        this.lights.player_light.target.position.z = this.flower.position.z + 10*Math.sin(this.flower.angle);
        // this.lights.player_light.target.position.x = this.flower.position.x;
        // this.lights.player_light.target.position.y = this.flower.position.y + 0;
        // this.lights.player_light.target.position.z = this.flower.position.z;
        console.log("Player", this.lights.player_light.position);
        console.log("Target", this.lights.player_light.target.position);
        this.add(this.lights.player_light.target);
        // console.log("Position", this.lights.player_light.position);
        // console.log("Target", this.lights.player_light.target.position);
        this.translate(keys);
        if (keys[' ']) {
            this.flower.attack_pressed = true;
        }
        else {
            this.flower.attack_pressed = false;
        }
    }


    spin() {
        console.log("spinning");
        this.flower.spin();
    }

    translate(keys_down) {
        let speed = 0.06;
        let x_change = 0;
        let z_change = 0;
        // let x_change = keys_down['a'] - keys_down['d'];
        // let z_change = keys_down['w'] - keys_down['s'];
        if (keys_down['w']) {
            z_change += 1;
        }
        if (keys_down['s']) {
            z_change -= 1;
        }
        if (keys_down['a']) {
            x_change += 1;
        }
        if (keys_down['d']) {
            x_change -= 1;
        }
        if (x_change != 0 || z_change != 0) {
            x_change = x_change/Math.sqrt(x_change*x_change + z_change*z_change);
            z_change = z_change/Math.sqrt(x_change*x_change + z_change*z_change);
        }
        
        console.log(x_change, z_change);

        this.flower.translate(x_change * speed, z_change * speed);
    }

    attack() {

    }
}

export default SeedScene;
