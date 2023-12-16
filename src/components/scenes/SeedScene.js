import * as Dat from 'dat.gui';
import { Scene, Color, Vector3 } from 'three';
import { Fox, Land, Raccoon, BigRaccoon, Bolt, Syringe, Trap, PineTree, Grass, Cube } from 'objects';
import { BasicLights } from 'lights';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';



class SeedScene extends Scene {
    constructor(timerElement, batteryElement, startScreen, endScreen, syringeCounter) {
        // Call parent Scene() constructor

        super();
        
        // all the 3D models (.glb, .gltf) have been downloaded from https://sketchfab.com/
        // all the meshes are under the Free Licensing Model: Under basic restrictions, use worldwide,
        // on all types of media, commercially or not, and in all types of derivative works

        this.timer = timerElement;
        this.battery = batteryElement;
        this.syringeCounter = syringeCounter;
        this.startScreen = startScreen;
        this.startScreen.style.visibility = 'visible';
        this.endScreen = endScreen;
        this.stage_radius = 12;
        this.highscore = 0;
        this.last_spawn = 0;
        this.spawn_interval = 5000;

        this.last_big_spawn = 0;
        this.big_spawn_interval = 30000;

        this.last_bolt_spawn = 0;
        this.bolt_spawn_interval = 5000;

        this.last_syringe_spawn = 0;
        this.syringe_spawn_interval = 20000;

        this.first_update = true;
        this.background = new Color(0x000000);

        this.lights = new BasicLights();
        this.lights.moon_light.intensity = 5;
        this.lights.moon_light.position.x = 0;
        this.lights.moon_light.position.z = 0;
        this.lights.moon_light.position.y = this.stage_radius + 4;
        this.lights.moon_light.target.position.x = 0;
        this.lights.moon_light.target.position.z = 0;
        this.lights.moon_light.target.position.y = 0;
        this.add(this.lights.moon_light.target);

        // Add meshes to scene
        this.land = new Land();
        this.fox = new Fox(this);
        this.syringes = [];
        this.num_syringes = 0;
        this.bolts = [];
        this.num_bolts = 0;
        this.syringe = new Syringe();
        this.cube = new Cube();
        this.last_restart = 0;

        this.raccoons =[];
        this.num_raccoons = 0;
        this.big_raccoons = [];
        this.num_big = 0;

        this.game_over = false;
        this.resetting = false;

        this.add(this.fox);
        this.add(this.lights);
        this.add(this.lights.syringe_light.target);
        this.add(this.lights.bolt_light.target);
        this.add(this.syringe);
        this.add(this.cube);

        this.cube.position.y = -50;

        this.createScenery();
    }

    createScenery() {
        let r = this.stage_radius;
        
        for (let angle = 0; angle < (2 * Math.PI); angle += (Math.PI / 18)) {
            this.add(new PineTree((r+3)*Math.cos(angle), 0, (r+3)*Math.sin(angle)));
            this.add(new PineTree((r+2)*Math.cos(angle + (Math.PI/36)), 0, (r+2)*Math.sin(angle + (Math.PI/36))));
            this.add(new PineTree((r+1)*Math.cos(angle), 0, (r+1)*Math.sin(angle)));
            this.add(new PineTree(r*Math.cos(angle + (Math.PI/36)), 0, r*Math.sin(angle + (Math.PI/36))));
        }
    }

    reset(timestamp) {
        console.log("reset");
        this.game_over = false;
        this.highscore = this.score;
        this.endScreen.style.visibility = 'hidden';
        this.remove(this.fox);
        for (let raccoon of this.raccoons) {
            this.remove(raccoon);
        }
        for (let raccoon of this.big_raccoons) {
            this.remove(raccoon);
        }

        this.fox = new Fox(this);
        this.add(this.fox);
        this.raccoons = [];
        this.big_raccoons = [];
        this.num_raccoons = 0;
        this.num_big = 0;
        this.num_bolts = 0;
        this.num_syringes = 0;
        this.timer.innerText = "Score: 0";
        this.last_restart = Math.floor(timestamp / 1000);

        this.last_spawn = 0;
        this.last_big_spawn = 0;
        this.last_bolt_spawn = 0;
        this.last_syringe_spawn = 0;
        this.spawn_interval = 5000;
        this.big_spawn_interval = 30000;
        this.bolt_spawn_interval = 5000;
        this.syringe_spawn_interval = 20000;

    }

    add_bolt() {
        console.log('adding bolts');
        let theta = 2 * Math.PI * (Math.random());
        let r = Math.sqrt(Math.random()) * (this.stage_radius - 4) + 2;
        let x0 = r * Math.cos(theta);
        let z0 = r * Math.sin(theta);
        let dx = x0 - this.fox.position.x;
        let dz = z0 - this.fox.position.z;
        if (Math.sqrt(dx*dx + dz*dz) < 5) {
            x0 = -x0;
            z0 = -z0;
        }
        let new_bolt = new Bolt(this, x0, z0);
        this.bolts.push(new_bolt);
        this.add(new_bolt);
        this.num_bolts += 1;

        this.lights.bolt_light.position.x = x0;
        this.lights.bolt_light.position.z = z0;
        this.lights.bolt_light.position.y = 2;
        this.lights.bolt_light.target.position.x = x0;
        this.lights.bolt_light.target.position.z = z0;
        this.lights.bolt_light.target.position.y = 0;
        this.lights.bolt_light.intensity = 5;
    }

    add_syringe() {
        console.log('adding syringe');
        let theta = 2 * Math.PI * (Math.random());
        let r = Math.sqrt(Math.random()) * (this.stage_radius - 4) + 2;
        let x0 = r * Math.cos(theta);
        let z0 = r * Math.sin(theta);
        let dx = x0 - this.fox.position.x;
        let dz = z0 - this.fox.position.z;
        if (Math.sqrt(dx*dx + dz*dz) < 5) {
            x0 = -x0;
            z0 = -z0;
        }
        let new_syringe = new Syringe(this, x0, z0);
        this.syringes.push(new_syringe);
        this.add(new_syringe);
        this.num_syringes += 1;

        this.lights.syringe_light.position.x = x0;
        this.lights.syringe_light.position.z = z0;
        this.lights.syringe_light.position.y = 2;
        this.lights.syringe_light.target.position.x = x0;
        this.lights.syringe_light.target.position.z = z0;
        this.lights.syringe_light.target.position.y = 0;
        this.lights.syringe_light.intensity = 5;
    }


    add_raccoon(timestamp) {
        console.log('adding raccoon');
       let theta = Math.random() * 2 * Math.PI;
       let x0 = Math.cos(theta) * (this.stage_radius + 1);
       let z0 = Math.sin(theta) * (this.stage_radius + 1);
       let dx = x0 - this.fox.position.x;
       let dz = z0 - this.fox.position.z;
       if (Math.sqrt(dx*dx + dz*dz) < 5) {
        x0 = -x0;
        z0 = -z0;
       }
       
       let secs = (timestamp - 1000*this.last_restart) / 30000 + 1;
       let speed = 0.02 + (1/40) * ((timestamp - 1000*this.last_restart) / (1000*100));
       if (speed > 0.05) {
        speed = 0.05;
       }
       let new_raccoon = new Raccoon(this, this.fox, x0, z0, secs, speed);
       this.raccoons.push(new_raccoon);
       this.add(new_raccoon);
       this.num_raccoons += 1;
    }

    add_big_raccoon(timestamp) {
        console.log('adding big');
        let theta = Math.random() * 2 * Math.PI;
        let x0 = Math.cos(theta) * (this.stage_radius + 1);
        let z0 = Math.sin(theta) * (this.stage_radius + 1);
        let dx = x0 - this.fox.position.x;
        let dz = z0 - this.fox.position.z;
        if (Math.sqrt(dx*dx + dz*dz) < 5) {
         x0 = -x0;
         z0 = -z0;
        }

 
        let new_raccoon = new BigRaccoon(this, this.fox, x0, z0);
        this.big_raccoons.push(new_raccoon);
        this.add(new_raccoon);
        this.num_big += 1;
     }

    update(timeStamp, keys, camera) {
        console.log("Num raccoons", this.num_raccoons);
        
        let camera_pos = this.fox.position.clone();
        camera.position.x = camera_pos.x + 5*Math.cos(this.fox.angle);
        camera.position.y = camera_pos.y + 5;
        camera.position.z = camera_pos.z - 5*Math.sin(this.fox.angle);
        let vaccine_string = "💉".repeat(this.fox.num_syringes);
        this.syringeCounter.innerText = "Vaccines: "+ vaccine_string;

        let lookAtPos = new Vector3(0, 0, 0);
        lookAtPos.x = this.fox.position.x - Math.cos(this.fox.angle);
        lookAtPos.z = this.fox.position.z + Math.sin(this.fox.angle);
        lookAtPos.y = this.fox.position.y + 2;
        camera.lookAt(lookAtPos);

        if (this.first_update && timeStamp > 5000) {
            console.log("first update!");
            this.startScreen.innerHTML += "<p>Press k to start game!</p>";
            this.first_update = false;
        }

        if (this.startScreen.style.visibility != 'hidden') {
            if (keys['k'] && timeStamp > 5000) {
                this.startScreen.style.visibility = 'hidden';
                this.last_restart = Math.floor(timeStamp/1000);
            }
            else {
                return;
            }
        }

        if (keys['r'] && this.game_over) {
            this.resetting = true;
        }
        else {
            if (this.resetting) {
                this.resetting = false;
                this.reset(timeStamp);
            }
        }

        this.time = timeStamp - 1000 * this.last_restart;

        if (this.game_over) {
            let s = "Ahhhhhhh! <br> You Got Rabies!<br><br>" + 
            "Your score is " + this.score + "<br>";
            if (this.score > this.highscore) {
                
                s = s + "New highscore! <br>";
            }
            else {
                s = s + "Your highscore is still " + this.highscore + "<br>";
            }
            s = s + "<br>Press r to restart";
            this.endScreen.innerHTML = s;
            this.endScreen.style.visibility = 'visible';
            return;
        }
        this.score = (Math.floor(timeStamp / 1000) - this.last_restart)
        this.timer.innerText = "Score: " + this.score;
        let bat = Math.max(0, this.fox.battery);
        this.battery.innerText = "Battery: " + Math.floor(bat * 100) + "%";
    
        for (let raccoon of this.raccoons) {
            raccoon.update_2(timeStamp);
        }
        for (let raccoon of this.big_raccoons) {
            raccoon.update_2(timeStamp);
        }
        for (let bolt of this.bolts) {
            bolt.update();
        }
        for (let syringe of this.syringes) {
            syringe.update();
        }
        
        this.fox.update(timeStamp);

        this.lights.player_light.position.x = this.fox.position.x;
        this.lights.player_light.position.y = this.fox.position.y + 1;
        this.lights.player_light.position.z = this.fox.position.z;
        this.lights.player_light.target.position.x = this.fox.position.x - 10*Math.cos(this.fox.angle);
        this.lights.player_light.target.position.y = this.fox.position.y + 0;
        this.lights.player_light.target.position.z = this.fox.position.z + 10*Math.sin(this.fox.angle);

        this.add(this.lights.player_light.target);
        this.add(this.lights.attack_light.target);
        this.translate(keys, camera);

        if (keys['l']) {
            this.fox.attack2_pressed = true;
        }
        else {
            this.fox.attack2_pressed = false;
        }

        if (keys[' ']) {
            this.fox.attack_pressed = true;
        }
        else {
            this.fox.attack_pressed = false;
        }

        if (this.time - this.last_spawn > this.spawn_interval && this.num_raccoons < 20) {
            this.last_spawn = this.time;
            this.add_raccoon(timeStamp);
            if (this.spawn_interval > 3000) {
                this.spawn_interval -= 200;
            }
        }
        if (this.time - this.last_big_spawn > this.big_spawn_interval && this.num_big < 5) {
            this.last_big_spawn = this.time;
            this.add_big_raccoon(timeStamp);
            if (this.big_spawn_interval > 20000) {
                this.spawn_interval -= 1000;
            }
        }
        if (this.time - this.last_bolt_spawn > this.bolt_spawn_interval && this.num_bolts == 0) {
            this.last_bolt_spawn = this.time;
            this.add_bolt();
            this.bolt_spawn_interval += 1000;
        }
        if (this.time - this.last_syringe_spawn > this.syringe_spawn_interval && this.num_syringes == 0 && this.fox.num_syringes <= 3) {
            this.last_syringe_spawn = this.time;
            this.syringe_spawn_interval += 2000;
            this.add_syringe();
        }
    }


    spin() {

        this.fox.spin();
    }

    translate(keys_down, camera) {
        let speed = 0.06;
        let x_change = 0;
        let z_change = 0;

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
        

        let diff_x = -(this.fox.position.x - camera.position.x);
        let diff_z = this.fox.position.z - camera.position.z;
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


        x_change_2 = -x_change_2;

        this.fox.translate(x_change_2 * speed, z_change_2 * speed);

    }
}

export default SeedScene;
