var Colors = {
	unused: 0x000000,
  highlighted: 0x000000,
  clicked: 0x000000,
  used: 0x000000
};


class Neuron extends GameObject {
  constructor () {
    super();
    this.geom = new THREE.SphereGeometry(15, 7, 8);
    this.mat = new THREE.MeshPhongMaterial({
      color:0xFDB813,
      shading:THREE.FlatShading,
    });
    this.mesh = new THREE.Mesh(this.geom, this.mat);

		this.mesh.mouseOver = this.mouseOver;
  }

  update() {
    //this.moveWaves();
    this.mat.color.set(0xFDB813);
  }

  init() {
    //document.addEventListener('keypress', this.moveNeuron.bind(this), false);

    // important: by merging vertices we ensure the continuity of the waves
    this.geom.mergeVertices();

    this.waves = [];

    // get the vertices
    var l = this.geom.vertices.length;
    for (var i=0; i<l; i++){
      // get each vertex
      var nextVertex = this.geom.vertices[i];
      this.waves.push(
        {	x:nextVertex.x,
          y:nextVertex.y,
          z:nextVertex.z,
          angle:0,//Math.random()*Math.PI*2,  //a random starting angle
          amplitude:(5 + Math.random()*nextVertex.y)/7, //a random value between 5 and 20
          frequency:(0.016 + Math.random()*0.032)*2 // a random speed between 0.016 and 0.048 radians / frame
        });
    }
  }

  moveNeuron(e) {
    console.log(this.mesh.position);
    var unicode=e.keyCode? e.keyCode : e.charCode
    if(unicode === 97) {//left {
      this.mesh.position.x -= 10;
    } else if (unicode === 119) {//up {
      this.mesh.position.y += 10;
    } else if (unicode === 100) {//right {
      this.mesh.position.x += 10;
    } else if (unicode === 115) {//down {
      this.mesh.position.y -= 10;
    }
  }
}

Neuron.prototype.moveWaves = function (){
  // get the vertices
	var verts = this.mesh.geometry.vertices;
	var l = verts.length;

	for (var i=0; i<l; i++){
		var v = verts[i];

		// get the data associated to it
		var vprops = this.waves[i];

		// update the position of the vertex
		v.x = vprops.x + Math.cos(vprops.angle)*vprops.amplitude;
		v.y = vprops.y + Math.sin(vprops.angle)*vprops.amplitude;

		// increment the angle for the next frame
		vprops.angle += vprops.frequency;
	}

	// Tell the renderer that the geometry of the sea has changed.
	// In fact, in order to maintain the best level of performance,
	// three.js caches the geometries and ignores any changes
	// unless we add this line
	this.mesh.geometry.verticesNeedUpdate=true;
}
