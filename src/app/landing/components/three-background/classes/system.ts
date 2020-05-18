import { Particle } from './particle';
import * as THREE from 'three';
export class System {

   public loader: any;
   public calc: any;
   public ease: any;
   public sphereGeometry: any;
   public boxGeometry: any;
   public center: any;
   public particles: any;
   public particleGroup: any;
   public entering: any;
   public enterProgress: any;
   public enterRate: any;
   public exiting: any;
   public exitProgress: any;
   public exitRate: any;
   public duration: any;

   public rings: any;
   public radius: any;
   public radiusGrowth: any;

   constructor(loader) {
      this.loader = loader;

      this.calc = this.loader.calc;
      this.ease = this.loader.ease;

      this.sphereGeometry = new THREE.SphereBufferGeometry(1, 16, 16);
      this.boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
      this.center = new THREE.Vector3();

      this.particles = [];
      this.particleGroup = new THREE.Object3D();
      this.particleGroup.scale.set(0.0001, 0.0001, 0.0001);

      this.loader.scene.add(this.particleGroup);

      this.entering = true;
      this.enterProgress = 0;
      this.enterRate = 0.015;

      this.exiting = false;
      this.exitProgress = 0;
      this.exitRate = 0.01;

      this.duration = 15000;
      this.rings = 8;
      this.radius = 0;
      this.radiusGrowth = 1.5;

      for (let i = 0; i < this.rings; i++) {
         const count = i === 0 ? 1 : 1 + Math.ceil(i * 6);

         for (let j = 0; j < count; j++) {
            const angle = (j / count) * Math.PI * 2;
            const x = Math.cos(angle) * this.radius;
            const y = Math.sin(angle) * this.radius;
            const z = 0;
            const size = this.calc.map(i, 0, this.rings, 0.2, 0.05);

            this.particles.push(new Particle({
               group: this.particleGroup,
               x: x,
               y: y,
               z: z,
               size: size,
               radius: this.radius,
               angle: angle,
               color: 0xffffff,
               opacity: 1
            }, this, this.loader));
         }

         this.radius += this.radiusGrowth;
      }
   }

   update() {
      let i = this.particles.length;
      while (i--) {
         this.particles[ i ].update();
      }

      if (this.entering && this.enterProgress < 1) {
         this.enterProgress += this.enterRate * this.loader.deltaTimeNormal;
         if (this.enterProgress > 1) {
            this.enterProgress = 1;
            this.entering = false;
         }
         const scale = this.ease.inOutExpo(this.enterProgress, 0, 1, 1);
         this.particleGroup.scale.set(scale, scale, scale);
      }

      if (!this.exiting && this.loader.elapsedMilliseconds > this.duration) {
         this.exiting = true;
      }

      if (this.exiting) {
         this.exitProgress += this.exitRate * this.loader.deltaTimeNormal;
         if (this.exitProgress >= 1 && !this.loader.completed) {
            this.exitProgress = 1;
            this.loader.complete();
         }
      }

      if (this.exiting && !this.loader.isGrid && !this.loader.isGrid) {
         this.loader.camera.position.z = this.loader.cameraBaseZ - this.ease.inExpo(this.exitProgress, 0, 1, 1) * this.loader.cameraBaseZ;
      }
   }

   replay() {
      this.particleGroup.scale.set(0.0001, 0.0001, 0.0001);

      let i = this.particles.length;
      while (i--) {
         this.particles[ i ].reset();
      }

      this.entering = true;
      this.enterProgress = 0;

      this.exiting = false;
      this.exitProgress = 0;
   }

}

