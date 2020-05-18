import * as THREE from 'three';

export class Particle {

   public system: any;
   public loader: any;
   public calc: any;
   public ease: any;
   public group: any;
   public x: any;
   public y: any;
   public z: any;
   public size: any;
   public color: any;
   public opacity: any;
   public geometry: any;
   public material: any;
   public mesh: any;
   public angle: any;
   public radiusBase: any;
   public sizeBase: any;

   constructor(config, system, loader) {
      this.system = system;
      this.loader = loader;

      this.calc = this.loader.calc;
      this.ease = this.loader.ease;

      this.group = config.group;
      this.x = config.x;
      this.y = config.y;
      this.z = config.z;
      this.size = config.size;
      this.color = '#1f77b4';
      this.opacity = config.opacity;

      this.createMesh();

      this.angle = config.angle;
      this.radiusBase = config.radius;
      this.sizeBase = config.size;
   }

   update() {
      this.angle -= (Math.cos(this.loader.elapsedMilliseconds * 0.0025 - this.radiusBase * 0.15) * 0.02) * this.loader.deltaTimeNormal;

      this.mesh.position.x = Math.cos(this.angle) * this.radiusBase;
      this.mesh.position.y = Math.sin(this.angle) * this.radiusBase;
      this.mesh.position.z = Math.cos(this.loader.elapsedMilliseconds * 0.005 - this.radiusBase * 0.3) * 10;

      const freeScale = Math.cos(this.loader.elapsedMilliseconds * 0.005 - this.radiusBase * 0.6);
      const lockScale = this.calc.clamp(freeScale, 0, 1);
      const scale = this.sizeBase + lockScale * 0.2;
      this.mesh.scale.set(scale, scale, scale);
   }

   createMesh() {
      this.geometry = this.system.sphereGeometry;

      this.material = new THREE.MeshBasicMaterial({
         color: this.color,
         transparent: true,
         opacity: this.opacity,
         depthTest: false,
         precision: 'lowp'
      });

      this.mesh = new THREE.Mesh(this.geometry, this.material);

      this.mesh.position.x = this.x;
      this.mesh.position.y = this.y;
      this.mesh.position.z = this.z;

      this.mesh.scale.set(this.size, this.size, this.size);

      this.group.add(this.mesh);
   }

   reset() {
   }

}
