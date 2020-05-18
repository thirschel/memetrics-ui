import * as THREE from 'three';

export class AxisHelper {

   public object3d: any;
   public axisLength: any;
   public opacity: any;

   constructor(axisLength, opacity) {
      this.object3d = new THREE.Object3D();
      this.axisLength = axisLength;
      this.opacity = opacity;

      this.createAxis(
         new THREE.Vector3(-this.axisLength, 0, 0),
         new THREE.Vector3(this.axisLength, 0, 0),
         new THREE.Color('hsl(0, 100%, 100%)')
      );

      this.createAxis(
         new THREE.Vector3(0, -this.axisLength, 0),
         new THREE.Vector3(0, this.axisLength, 0),
         new THREE.Color('hsl(120, 100%, 100%)')
      );

      this.createAxis(
         new THREE.Vector3(0, 0, -this.axisLength),
         new THREE.Vector3(0, 0, this.axisLength),
         new THREE.Color('hsl(240, 100%, 100%)')
      );

      return this.object3d;
   }

   createAxis(p1, p2, color) {
      const geom = new THREE.Geometry();
      const mat = new THREE.LineBasicMaterial({
         color: color,
         opacity: this.opacity,
         transparent: true
      });
      geom.vertices.push(p1, p2);
      const line = new THREE.Line(geom, mat);
      this.object3d.add(line);
   }

}
