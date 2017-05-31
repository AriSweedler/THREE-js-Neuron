class Neuron extends GameObject {
  constructor () {
    super();
    var geom = new THREE.SphereGeometry(30, 7, 4);
    var mat = new THREE.MeshPhongMaterial({
      color:0xFDB813,
      shading:THREE.FlatShading,
    });
    this.mesh = new THREE.Mesh(geom, mat);
    //this.myTotal = 0;
  }

  update() {
    //this.myTotal++;
    //console.log("updating my neuron: " + this.myTotal);
  }
}
