import { Group, SpotLight, AmbientLight, HemisphereLight } from 'three';

class BasicLights extends Group {
    constructor(...args) {
        // Invoke parent Group() constructor with our args
        super(...args);

        // const dir = new SpotLight(0xffffff, 1.6, 7, 0.8, 1, 1);
        // const ambi = new AmbientLight(0x404040, 1.32);
        // const hemi = new HemisphereLight(0xffffbb, 0x080820, 2.3);

        const player_light = new SpotLight(0xffff00, 10, 100, 0.5, 0.4, 0.8);
        const attack_light = new SpotLight(0xffffff, 0, 10, Math.PI/4, 0.2, 2);
        const bolt_light = new SpotLight(0xffff00, 0, 10, Math.PI/4, 0.2, 2);
        const syringe_light = new SpotLight(0xADD8E6, 0, 10, Math.PI/4, 0.2, 2);

        const moon_light = new SpotLight('purple', 1, 1000, Math.PI/4, 0.2, 2);
        // const dir = new SpotLight(0xff00ff, 0, 7, 0.8, 1, 1);
        const ambi = new AmbientLight(0x404040, 1.32);
        // const hemi = new HemisphereLight(0xffffbb, 0x080820, 0.3);

        // dir.position.set(5, 1, 2);
        // dir.target.position.set(10, 0, 10);
        // console.log(player_light);
        player_light.position.set(30, 3, 3)
        this.player_light = player_light;
        this.attack_light = attack_light;
        this.moon_light = moon_light;
        this.bolt_light = bolt_light;
        this.syringe_light = syringe_light;
        this.add(bolt_light, syringe_light, moon_light, player_light, attack_light);
    }
}

export default BasicLights;
