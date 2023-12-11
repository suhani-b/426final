import { Group, SpotLight, AmbientLight, HemisphereLight } from 'three';

class BasicLights extends Group {
    constructor(...args) {
        // Invoke parent Group() constructor with our args
        super(...args);

        // const dir = new SpotLight(0xffffff, 1.6, 7, 0.8, 1, 1);
        // const ambi = new AmbientLight(0x404040, 1.32);
        // const hemi = new HemisphereLight(0xffffbb, 0x080820, 2.3);

        const player_light = new SpotLight(0xffffff, 10, 10, 0.5, 0.4, 0.8);
        const dir = new SpotLight(0xffffff, 0, 7, 0.8, 1, 1);
        const ambi = new AmbientLight(0x404040, 1.32);
        const hemi = new HemisphereLight(0xffffbb, 0x080820, 0.3);

        dir.position.set(5, 1, 2);
        dir.target.position.set(0, 0, 0);
        // console.log(player_light);
        this.player_light = player_light;
        this.add(ambi, hemi, dir, player_light);
    }
}

export default BasicLights;
