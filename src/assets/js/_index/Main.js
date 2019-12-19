const ENV = require('../_env');
const g = window[ENV.projectName] = window[ENV.projectName] || {};

export default class Main {
  constructor() {
    this.init();
  }

  async init() {
    this.modelViewer = document.querySelector('model-viewer');
    // this.cover = document.querySelector('.js-cover');

    await new Promise((resolve, reject)=> {
      this.modelViewer.addEventListener('error', (e)=> {
        reject(e);
      });

      // this.modelViewer.addEventListener('model-visibility', ()=> { resolve(); });
      this.modelViewer.addEventListener('load', ()=> {
        // this.cover.parentElement.removeChild(this.cover);
        resolve();
      });
    });

    // window.addEventListener('resize', this.onResize.bind(this));
  }

  start() {
  }

  update() {
  }

  render() {
  }

  async onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.modelViewer.style.width = `${this.width}px`;
    this.modelViewer.style.height = `${this.height}px`;
  }
}
