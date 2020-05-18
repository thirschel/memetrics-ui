import { Calc } from '../utils/calc';
import { Ease } from '../utils/ease';
import { AxisHelper } from '../utils/axis-helper';
import * as THREE from 'three';

export class Loader {

   public calc: any;
   public ease: any;
   public dom: any;
   public completed: any;
   public raf: any;
   public system: any;
   public timescale: any;
   public clock: any;
   public deltaTimeSeconds: any;
   public deltaTimeMilliseconds: any;
   public deltaTimeNormal: any;
   public elapsedMilliseconds: any;
   public scene: any;
   public camera: any;
   public isGrid: any;
   public cameraBaseX: any;
   public cameraBaseY: any;
   public cameraBaseZ: any;
   public renderer: any;
   public gridOpacityMap: any;
   public gridHelper: any;
   public axisOpacityMap: any;
   public axisHelper: any;
   public diffTime: any;
   public hidden: any;
   public visibilityChange: any;
   public blurTime: any;
   public focusTime: any;
   public width: any;
   public height: any;
   public dpr: any;

   constructor(System) {
      this.calc = new Calc();
      this.ease = new Ease();

      this.dom = {
         html: document.documentElement,
         container: document.querySelector('.loader'),
         replayButton: document.querySelector('.replay-animation'),
      };

      this.dom.html.classList.add('loading');

      this.completed = false;
      this.raf = null;

      this.setupTime();
      this.setupScene();
      this.setupCamera();
      this.setupRenderer();
      this.setupHelpers();
      this.listen();
      this.onResize();

      this.system = new System(this);
      this.loop();
   }

   setupTime() {
      this.timescale = .8;
      this.clock = new THREE.Clock();
      this.deltaTimeSeconds = this.clock.getDelta() * this.timescale;
      this.deltaTimeMilliseconds = this.deltaTimeSeconds * 1000;
      this.deltaTimeNormal = this.deltaTimeMilliseconds / (1000 / 60);
      this.elapsedMilliseconds = 0;
   }

   setupScene() {
      this.scene = new THREE.Scene();
   }

   setupCamera() {
      this.camera = new THREE.PerspectiveCamera(100, 0, 0.0001, 10000);

      this.cameraBaseX = this.isGrid ? -20 : 0;
      this.cameraBaseY = this.isGrid ? 15 : 0;
      this.cameraBaseZ = this.isGrid ? 20 : 30;

      this.camera.position.x = this.cameraBaseX;
      this.camera.position.y = this.cameraBaseY;
      this.camera.position.z = this.cameraBaseZ;
   }

   setupRenderer() {
      this.renderer = new THREE.WebGLRenderer({
         alpha: true,
         antialias: true
      });

      this.dom.container.appendChild(this.renderer.domElement);
   }


   setupHelpers() {
      if (this.isGrid) {
         this.gridOpacityMap = [
            0.4, // 1
            0.2, // 2
            0.2, // 3
            0.2, // 4
            0.1, // 5
            0.2, // 6
            0.1, // 7
            0.1  // 8
         ];
         this.gridHelper = new THREE.GridHelper(300, 60, 0xffffff, 0xffffff);
         this.gridHelper.material.transparent = true;
         this.gridHelper.material.opacity = this.gridOpacityMap[ 0 ];
         this.scene.add(this.gridHelper);

         this.axisOpacityMap = [
            1, // 1
            0.6, // 2
            0.6, // 3
            0.6, // 4
            0.3, // 5
            0.6, // 6
            0.3, // 7
            0.3  // 8
         ];
         this.axisHelper = new AxisHelper(150, this.axisOpacityMap[ 0 ]);
         this.scene.add(this.axisHelper);

         this.camera.lookAt(new THREE.Vector3());
      }
   }

   update() {
      this.deltaTimeSeconds = this.clock.getDelta();
      if (this.diffTime) {
         this.deltaTimeSeconds -= this.diffTime;
         this.diffTime = 0;
      }
      this.deltaTimeSeconds *= this.timescale;
      this.deltaTimeMilliseconds = this.deltaTimeSeconds * 1000;
      this.deltaTimeNormal = this.deltaTimeMilliseconds / (1000 / 60);
      this.elapsedMilliseconds += this.deltaTimeMilliseconds;

      this.system.update();

   }

   render() {
      this.renderer.render(this.scene, this.camera);
   }

   listen() {
      window.addEventListener('resize', (e) => this.onResize());

      this.hidden = null;
      this.visibilityChange = null;
      if (typeof document.hidden !== 'undefined') {
         this.hidden = 'hidden';
         this.visibilityChange = 'visibilitychange';
      } else if (typeof document[ 'msHidden' ] !== 'undefined') {
         this.hidden = 'msHidden';
         this.visibilityChange = 'msvisibilitychange';
      } else if (typeof document[ 'webkitHidden' ] !== 'undefined') {
         this.hidden = 'webkitHidden';
         this.visibilityChange = 'webkitvisibilitychange';
      }
      if (typeof document.addEventListener === 'undefined' || typeof document.hidden === 'undefined') {
      } else {
         window.addEventListener(this.visibilityChange, (e) => this.onVisibilityChange(e));
      }
   }

   replay() {
      this.camera.position.x = this.cameraBaseX;
      this.camera.position.y = this.cameraBaseY;
      this.camera.position.z = this.cameraBaseZ;

      this.timescale = 1;
      this.deltaTimeSeconds = 1 / 60;
      this.deltaTimeMilliseconds = this.deltaTimeSeconds * 1000;
      this.deltaTimeNormal = this.deltaTimeMilliseconds / (1000 / 60);
      this.elapsedMilliseconds = 0;
      this.blurTime = 0;
      this.diffTime = 0;
      this.focusTime = 0;

      this.system.replay();
      this.completed = false;
      this.clock.start();
      this.loop();
   }

   complete() {
      setTimeout(() => {
         this.clock.stop();
         cancelAnimationFrame(this.raf);
         if (this.completed) {
            this.replay();
         }
      }, 600);
      this.completed = true;
   }

   onResize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.dpr = window.devicePixelRatio > 1 ? 2 : 1;

      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();

      this.renderer.setPixelRatio(this.dpr);
      this.renderer.setSize(this.width, this.height);
   }

   onReplayButtonClick(e) {
      e.preventDefault();
      this.replay();
   }


   onVisibilityChange(e) {
      if (document.hidden) {
         this.blurTime = Date.now();
      } else {
         this.focusTime = Date.now();
         if (this.blurTime) {
            this.diffTime = (this.focusTime - this.blurTime) / 1000;
         }
      }
   }

   loop() {
      this.update();
      this.render();
      this.raf = window.requestAnimationFrame(() => this.loop());
   }

}
