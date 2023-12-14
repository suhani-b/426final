import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Flower, Land, Raccoon, Bolt, Syringe, Trap, PineTree } from 'objects';
import { BasicLights } from 'lights';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AmbientLight, Vector3 } from 'three';

class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        this.stage_radius = 8;

        this.last_spawn = 0;
        this.spawn_interval = 5000;

        this.last_bolt_spawn = 0;
        this.bolt_spawn_interval = 1000;

        // Init state
        // this.state = {
        //     gui: new Dat.GUI(), // Create GUI for scene
        //     rotationSpeed: 1,
        //     updateList: [],
        // };

        // Set background to a nice color
        this.background = new Color(0x230140);
        const ambient_light = new AmbientLight('white', 2);
        this.add(ambient_light)
        this.lights = new BasicLights();

        // Add meshes to scene
        this.land = new Land();
        this.flower = new Flower(this);
        this.syringe = new Syringe();
        this.trap = new Trap();
        this.bolts = [];
        this.num_bolts = 0;
        this.syringe = new Syringe();
        this.trap = new Trap();
        this.raccoons =[];
        this.add_raccoon(0);
        this.game_over = false;
        this.resetting = false;

        let r = this.stage_radius;
        
        for (let angle = 0; angle < (2 * Math.PI); angle += (Math.PI / 18)) {
            this.add(new PineTree((r+3)*Math.cos(angle), 0, (r+3)*Math.sin(angle)));
            this.add(new PineTree((r+2)*Math.cos(angle + (Math.PI/36)), 0, (r+2)*Math.sin(angle + (Math.PI/36))));
            this.add(new PineTree((r+1)*Math.cos(angle), 0, (r+1)*Math.sin(angle)));
            this.add(new PineTree(r*Math.cos(angle + (Math.PI/36)), 0, r*Math.sin(angle + (Math.PI/36))));
        }

        this.add(this.land, this.flower, this.lights, this.syringe, this.trap);

        // Populate GUI
        // this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
    }

    // addToUpdateList(object) {
    //     this.state.updateList.push(object);
    // }

    reset() {
        console.log("reset");
        this.game_over = false;
        this.remove(this.flower);
        for (let raccoon of this.raccoons) {
            this.remove(raccoon);
        }

        this.flower = new Flower(this);
        this.add(this.flower);
        this.raccoons = [];

    }

    add_bolt() {
        let theta = 2 * Math.PI * (Math.random());
        let r = Math.random() * this.stage_radius;
        let x0 = r * Math.cos(theta);
        let z0 = r * Math.sin(theta);

        let new_bolt = new Bolt(this, x0, z0);
        this.bolts.push(new_bolt);
        this.add(new_bolt);
        this.num_bolts += 1;
    }


    add_raccoon(timestamp) {
       let theta = Math.random() * 2 * Math.PI;
       let x0 = Math.cos(theta) * (this.stage_radius + 1);
       let z0 = Math.sin(theta) * (this.stage_radius + 1);
       let dx = x0 - this.flower.position.x;
       let dz = z0 - this.flower.position.z;
       if (Math.sqrt(dx*dx + dz*dz) < 5) {
        x0 = -x0;
        z0 = -z0;
       }
       
       let secs = timestamp / 10000 + 1;

       let new_raccoon = new Raccoon(this, this.flower, x0, z0, secs);
       this.raccoons.push(new_raccoon);
       this.add(new_raccoon);
    }

    update(timeStamp, keys, camera) {
        if (keys['r'] && this.game_over) {
            this.resetting = true;
        }
        else {
            if (this.resetting) {
                this.resetting = false;
                this.reset();
            }
        }
        if (this.game_over) {
            return;
        }

        // console.log(timeStamp);
        let camera_pos = this.flower.position.clone();
        // console.log(this.flower);
        camera.position.x = camera_pos.x + 8*Math.cos(this.flower.angle);
        camera.position.y = camera_pos.y + 5;
        camera.position.z = camera_pos.z - 8*Math.sin(this.flower.angle);
        // camera_pos.x = 10;
        // camera_pos.y = 10;
        // camera_pos.z = 10;
        // console.log(camera_pos);
        // camera.position.x = 10;
        // camera.position.y = 10;
        // camera.position.z = 10;
        // camera.position.set(camera_pos)
        // console.log("Cam", camera_pos);
        // console.log("Flow", this.flower.position);

        let lookAtPos = new Vector3(0, 0, 0);
        lookAtPos.x = this.flower.position.x - Math.cos(this.flower.angle);
        lookAtPos.z = this.flower.position.z + Math.sin(this.flower.angle);
        lookAtPos.y = this.flower.position.y + 2;
        camera.lookAt(this.flower.position);
        // camera.lookAt(lookAtPos);
        // const { rotationSpeed, updateList } = this.state;
        // this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        for (let raccoon of this.raccoons) {
            raccoon.update_2(timeStamp);
        }
        for (let bolt of this.bolts) {
            bolt.update();
        }
        
        this.flower.update(timeStamp);
        // for (const obj of updateList) {
        //     console.log(obj);
        //     obj.update(timeStamp);
        // }

        // console.log(this.lights.player_light);
        this.lights.player_light.position.x = this.flower.position.x;
        this.lights.player_light.position.y = this.flower.position.y + 1;
        this.lights.player_light.position.z = this.flower.position.z;
        this.lights.player_light.target.position.x = this.flower.position.x - 10*Math.cos(this.flower.angle);
        this.lights.player_light.target.position.y = this.flower.position.y + 0;
        this.lights.player_light.target.position.z = this.flower.position.z + 10*Math.sin(this.flower.angle);
        // this.lights.player_light.target.position.x = this.flower.position.x;
        // this.lights.player_light.target.position.y = this.flower.position.y + 0;
        // this.lights.player_light.target.position.z = this.flower.position.z;
        // console.log("Player", this.lights.player_light.position);
        // console.log("Target", this.lights.player_light.target.position);
        this.add(this.lights.player_light.target);
        // console.log("Position", this.lights.player_light.position);
        // console.log("Target", this.lights.player_light.target.position);
        this.translate(keys, camera);
        if (keys['l']) {
            this.flower.attack_pressed = true;
        }
        else {
            this.flower.attack_pressed = false;
        }

        if (timeStamp - this.last_spawn > this.spawn_interval) {
            this.last_spawn = timeStamp;
            this.add_raccoon(timeStamp);
        }
        if (timeStamp - this.last_bolt_spawn > this.bolt_spawn_interval && this.num_bolts == 0) {
            this.last_bolt_spawn = timeStamp;
            this.add_bolt();
        }
    }


    spin() {
        // console.log("spinning");
        this.flower.spin();
    }

    translate(keys_down, camera) {
        let speed = 0.06;
        let x_change = 0;
        let z_change = 0;
        // console.log(x_change, z_change);
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
            let len = Math.sqrt(x_change*x_change + z_change*z_change)
            x_change = x_change/len;
            z_change = z_change/len;
        }
        
        // console.log(x_change, z_change);
        let diff_x = -(this.flower.position.x - camera.position.x);
        let diff_z = this.flower.position.z - camera.position.z;
        let A = -diff_z;
        let C = diff_x;
        let B = diff_x;
        let D = diff_z;
        let x_change_2 = A * x_change + B * z_change;
        let z_change_2 = C * x_change + D * z_change;

        let old_length = Math.sqrt(x_change_2 * x_change_2 + z_change_2 * z_change_2);
        if (x_change_2 != 0 || z_change_2 != 0) {
            x_change_2 = x_change_2/old_length;
            z_change_2 = z_change_2/old_length;
        }

        // let temp = x_change_2;
        // x_change_2 = z_change_2;
        // z_change_2 = temp;

        x_change_2 = -x_change_2;



        // x_change_2 = x_change;
        // z_change_2 = z_change;

        this.flower.translate(x_change_2 * speed, z_change_2 * speed);
        // console.log(Math.sqrt((this.flower.position.x - camera.position.x) * (this.flower.position.x - camera.position.x) + (this.flower.position.z - camera.position.z) * (this.flower.position.z - camera.position.z)))
    }
}

export default SeedScene;
