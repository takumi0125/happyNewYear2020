const AXIS_X = new THREE.Vector3(1, 0, 0);
const AXIS_Y = new THREE.Vector3(0, 1, 0);
const AXIS_Z = new THREE.Vector3(0, 0, 1);

import SwappableRenderTexture from './SwappableRenderTexture';

export default class Fireworks {
  constructor(pointTexture, renderer, camera, commonPlaneGeometry) {
    this.init(pointTexture, renderer, camera, commonPlaneGeometry);
  }

  init(pointTexture, renderer, camera, commonPlaneGeometry = null) {
    this.pointTexture = pointTexture;
    this.renderer = renderer;
    this.camera = camera;
    this.commonPlaneGeometry = commonPlaneGeometry;

    this.pointSize = 20;
    this.numParticles = 2048;
    this.numParticlesInGroup = 16;
    this.lifeTime = 3;

    this.initData();

    this.initGeometry();
    this.initMaterial();

    // points
    this.points = new THREE.Points(this.geometry, this.material);
  }

  getDataTextureSize(n) {
    return Math.pow(2, parseInt(n).toString(2).length);
  }

  initGeometry() {
    // geometry
    this.geometry = new THREE.BufferGeometry();
    const vertices = [];
    const randomValues = [];
    const ids = [];
    for (let i = 0; i < this.numParticles; i++) {
      vertices.push(0);
      vertices.push(0);
      vertices.push(0);
      randomValues.push(Math.random());
      randomValues.push(Math.random());
      randomValues.push(Math.random());
      randomValues.push(Math.random());
      ids.push(i);
    }
    this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    this.geometry.setAttribute('vertexId', new THREE.BufferAttribute(new Float32Array(ids), 1));
    this.geometry.setAttribute('randomValues', new THREE.BufferAttribute(new Float32Array(randomValues), 4));
  }

  initMaterial() {
    // material
    this.material = new THREE.RawShaderMaterial({
      vertexShader: require('./_glsl/fireworks.vert'),
      fragmentShader: require('./_glsl/fireworks.frag'),
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false,
      transparent: true,
      uniforms: {
        pointSize: { type: '1f', value: this.pointSize },
        time: { type: '1f', value: 0 },
        lifeTime: { type: '1f', value: this.lifeTime },
        pointTexture: { type: 't', value: this.pointTexture },
        dataTextureSize: { type: '1f', value: this.dataTextureSize },
        dataTexture: { type: 't', value: this.renderTexture.getTexture() }
      }
    });
  }

  initData() {
    this.dataTextureSize = this.getDataTextureSize(this.numParticles);
    this.numParticles = this.dataTextureSize;

    const data = [];
    let v, index1, index2;
    const numGroups = this.numParticles / this.numParticlesInGroup;

    // velocity + timeOffset
    for(let i = 0; i < numGroups; i++) {
      let param = 1;
      v = new THREE.Vector3(0.9 + Math.random() * 0.1, 0, 0);
      v.applyAxisAngle(AXIS_Z, Math.random() * Math.PI * 2);
      v.applyAxisAngle(AXIS_Y, Math.random() * Math.PI * 2);
      v.applyAxisAngle(AXIS_X, Math.random() * Math.PI * 2);

      for(let j = 0; j < this.numParticlesInGroup; j++) {
        index1 = (i * this.numParticlesInGroup + j) * 4;
        index2 = index1 + this.numParticles * 4;

        data[index1 + 0] = 0;
        data[index1 + 1] = 0;
        data[index1 + 2] = 0;
        data[index1 + 3] = -j;

        data[index2 + 0] = v.x + (-0.5 + Math.random()) * 0.01;
        data[index2 + 1] = v.y + (-0.5 + Math.random()) * 0.01;
        data[index2 + 2] = v.z + (-0.5 + Math.random()) * 0.01;
        data[index2 + 3] = param;

        param *= 0.98;
      }
    }

    const initDataTexture = new THREE.DataTexture(new Float32Array(data), this.dataTextureSize, 2);
    initDataTexture.format = THREE.RGBAFormat;
    initDataTexture.type = THREE.FloatType;
    initDataTexture.minFilter = THREE.NearestFilter;
    initDataTexture.magFilter = THREE.NearestFilter;
    initDataTexture.generateMipmaps = false;

    this.calculatorMaterial = new THREE.RawShaderMaterial({
      vertexShader: require('./_glsl/calculator.vert'),
      fragmentShader: require('./_glsl/calculator.frag'),
      uniforms: {
        texture: { type: 't', value: initDataTexture },
        resolution: { type: '2f', value: new THREE.Vector2(this.dataTextureSize, 2) }
      }
    });

    this.renderTexture = new SwappableRenderTexture(this.dataTextureSize, 2, this.renderer, this.camera, this.calculatorMaterial, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      type: THREE.FloatType,
      format: THREE.RGBAFormat,
      generateMipmaps: false
    });
  }

  setDataTexture(dataTexture) {
    this.material.uniforms.dataTexture.value = dataTexture;
    this.material.needsUpdate = true;
  }

  update() {
    this.renderTexture.render();
    this.renderTexture.swapTexture();
    this.setDataTexture(this.renderTexture.getTexture());
  }

  burst() {
    new TimelineMax()
    .fromTo(this.material.uniforms.time, 20, { value: 0 }, { value: 20, ease: Linear.easeNone, onUpdate: ()=> {
      this.update();
    }});
  }
}