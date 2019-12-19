import Fireworks from './Fireworks';

export default class FireworksScene {
  constructor() {
  }

  async init(renderer, camera) {
    this.object = new THREE.Object3D();

    const pointTexture = await new Promise((resolve)=> {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load('./assets/img/point.png', (texture)=> {
        texture.needsUpdate = true;
        resolve(texture);
      });
    });

    const commonPlaneGeometry = new THREE.PlaneGeometry(100, 100);

    this.item = new Fireworks(pointTexture, renderer, camera, commonPlaneGeometry);
    window.burst = this.item.burst.bind(this.item);

    this.object.add(this.item.points);

    this.initDatGUI();
  }

  initDatGUI() {
    const dat = require('dat.gui');
    this.gui = new dat.GUI();
    this.gui.domElement.parentElement.style.zIndex = 100000;

    this.testValue = 0;
    this.gui.add(this, 'testValue', 0, 1, this.testValue).step(0.01)
    .onChange((value)=> {
      // this.material.uniforms.smoothUnionValue.value = value;
    });
  }
}