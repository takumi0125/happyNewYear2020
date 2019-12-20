export default class SwappableRenderTexture {
  constructor(width, height, renderer, camera, updateMaterial, options = {}, planeGeometry = null) {
    this.renderer = renderer;
    this.camera = camera;

    this.updateMaterial = updateMaterial;

    this.currentTextureIndex = 0;

    this.renderTargets = [
      new THREE.WebGLRenderTarget(width, height, options),
      new THREE.WebGLRenderTarget(width, height, options)
    ];

    if(!planeGeometry) planeGeometry = new THREE.PlaneGeometry(100, 100);

    this.scene = new THREE.Scene();
    this.plane = new THREE.Mesh(planeGeometry, this.updateMaterial);
    this.scene.add(this.plane);
  }

  render() {
    this.renderer.setRenderTarget(this.getRenderTarget());
    this.renderer.render(this.scene, this.camera);
    this.renderer.setRenderTarget(null);
  }

  setMaterial(material) {
    this.updateMaterial = material;
    this.plane.material = this.updateMaterial;
    this.plane.material.needsUpdate = true;
  }

  setUniformValue(key, value) {
    this.updateMaterial.uniforms[key].value = value;
  }

  swapTexture() {
    this.plane.material.uniforms.texture.value = this.getTexture();
    this.plane.material.needsUpdate = true;
    this.currentTextureIndex = (this.currentTextureIndex + 1) % 2;
  }

  getTexture() {
    return this.getRenderTarget().texture;
  }

  getRenderTarget() {
    return this.renderTargets[this.currentTextureIndex];
  }

  setSize(width, height) {
    this.renderTargets[0].setSize(width, height);
    this.renderTargets[1].setSize(width, height);
  }
};
