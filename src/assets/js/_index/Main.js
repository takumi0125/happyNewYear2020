const ENV = require('../_env');
const g = window[ENV.projectName] = window[ENV.projectName] || {};

const _3D_MODEL_DIR = './assets/3d/'

export default class Main {
  constructor() {
    this.init();
  }

  async init() {
    this.modelViewer = document.querySelector('model-viewer');
    this.cover = document.querySelector('.js-cover');
    this.loading = document.querySelector('.js-loading');

    // AR OK
    if(g.isiOS) {
      await this.initARiOS();
    } else {
      await this.initARAndroid();
    }

    await this.removeLoading();
  }

  async removeLoading() {
    await new Promise((resolve, reject)=> {
      this.loading.classList.add('is-loaded');
      setTimeout(()=> {
        this.loading.parentElement.removeChild(this.loading);
        resolve();
      }, 600);
    });
  }

  checkIfARAvailable() {
    const arButton = this.modelViewer.shadowRoot.querySelector('.ar-button');
    return arButton && arButton.classList.contains('enabled');
  }

  async initARiOS() {
    // リッチなanimationのモデルを読み込み
    // webgl上では空のはがきを表示して
    // AR上ではじめてアニメーションを見せる
    this.modelViewer.iosSrc=`${_3D_MODEL_DIR}hagaki_ios.usdz`;
    this.modelViewer.src=`${_3D_MODEL_DIR}hagaki_empty.glb`;

    await new Promise((resolve, reject)=> {
      this.modelViewer.addEventListener('load', async (e)=> {
        if(this.checkIfARAvailable()) {
          this.cover.classList.add('is-AR');
        } else {
          await this.initNotAR(true);
        }
        resolve();
      }, { once: true });
    });
  }

  async initARAndroid() {
    // single animationのモデルを読み込み
    this.modelViewer.src=`${_3D_MODEL_DIR}hagaki.glb`;

    await new Promise((resolve, reject)=> {
      this.modelViewer.addEventListener('load', async (e)=> {
        if(this.checkIfARAvailable()) {
          this.cover.classList.add('is-AR');
        } else {
          this.initNotAR(false);
        }
        resolve();
      }, { once: true });
    });
  }

  async initNotAR(load = false) {
    this.cover.classList.add('is-notAR');

    if(!load) return;

    this.modelViewer.src=`${_3D_MODEL_DIR}hagaki.glb`;
    await new Promise((resolve, reject)=> {
      this.modelViewer.addEventListener('load', (e)=> {
        resolve();
      }, { once: true });
    });
  }

  async onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.modelViewer.style.width = `${this.width}px`;
    this.modelViewer.style.height = `${this.height}px`;
  }
}
