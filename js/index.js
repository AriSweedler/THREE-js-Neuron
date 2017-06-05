var Colors = {
	red:0xf25346,
	white:0xd8d0d1,
	brown:0x59332e,
	pink:0xF5986E,
	brownDark:0x23190f,
	blue:0x68c3c0,
};

window.addEventListener('load', init, false);
function init() {
	createScene(); 	// set up the scene, the camera and the renderer
	createLights(); // add the lights

	//add the objects
	for(let i = 0; i < 5; i++) {
		let n = new Neuron(i);
		n.mesh.position.x = (-75) + (40*i); //+ (-5 + Math.random()*10);
		n.mesh.position.y = (50); //(-3 + Math.random()*6);

		addToMyGame(n);
	}

	scene.loop();
}

/**************************************/
/*********create our scene*************/
var container, controls;
function createScene() {
	container = document.getElementById('world');	//We have our container be any HTML DOM object

	//For now, we want the width and height of our global window object. But later, we might want our entire THREE.js scene to reside in a different spot
	container.innerWidth = this.innerWidth;
	container.innerHeight = this.innerHeight;
  this.WIDTH = container.innerWidth;	//these are useful to write down
	this.HEIGHT = container.innerHeight;

	createSceneInstance();
	createPlayer();
	createCameraInstance();
	createRendererInstance();
	createClickyShit();
	createControls();

	//If the user resizes it we have to update the camera and the renderer size
	window.addEventListener('resize', handleWindowResize, false);
}

/**************************************/
/********init helper functions*********/
var scene, camera, player, renderer, centerOfScene,
		projector, raycaster;
function createSceneInstance() {
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog(0xf7d9aa, 100, 1150);
	scene.objects = [];
	scene.loop = update;
}

var hemisphereLight, ambientLight;
function createLights() {
	// an ambient light modifies the global color of a scene and makes the shadows softer
	ambientLight = new THREE.AmbientLight(0xc03c40, .16);
	scene.add(ambientLight);

	// A "hemisphere light" is a gradient colored light;
	//this is what we're using to illuminate our objects
	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)
	scene.add(hemisphereLight);
}

function createCameraInstance() {
	// Create the camera
	let aspectRatio = WIDTH / HEIGHT;
	let fieldOfView = 60;
	let nearPlane = 1;
	let farPlane = 10000;
	camera = new THREE.PerspectiveCamera(
		fieldOfView,
		aspectRatio,
		nearPlane,
		farPlane
	);

	centerOfScene = {x: 0, y: 0, z: 0};
	// need three numeric parameters for camera.position.set
	// Make sure to move the camera back 200 units from the center of the scene so we can actually see
	camera.LookVector = new THREE.Vector3(0, 0, 200);
	camera.position.set(centerOfScene.x, centerOfScene.y, centerOfScene.z + 200);
	camera.lookAt(new THREE.Vector3(centerOfScene.x, centerOfScene.y, centerOfScene.z));
	//need a THREE.Vector3 object as a parameter for camera.lookAt

	camera.moveSpeed = 3;
	camera.position.target = {};
	camera.position.target.x = centerOfScene.x;
	camera.position.target.y = centerOfScene.y;
	camera.position.target.z = centerOfScene.z+200;
}
function createPlayer() {
	player = new THREE.Group();

	player.up = new THREE.Mesh(
		new THREE.CylinderGeometry(3, 3, 10, 3),
		new THREE.MeshBasicMaterial()
	);
	player.up.ball = new THREE.Mesh(
		new THREE.SphereGeometry(1, 10, 10),
		new THREE.MeshBasicMaterial()
	);
	player.up.ball.position.y += 5;
	player.up.add(player.up.ball);
	player.up.material.color.set(0x00ff00);
	player.up.position.y += 5;
	//up.material.wireframe = true;
	player.up.geometry.applyMatrix(new THREE.Matrix4().makeRotationY(-Math.PI/2));
	player.add(player.up);

	player.forward = new THREE.Mesh(
		new THREE.CylinderGeometry(3, 3, 10, 3),
		new THREE.MeshBasicMaterial()
	);
	player.forward.ball = new THREE.Mesh(
		new THREE.SphereGeometry(1, 10, 10),
		new THREE.MeshBasicMaterial()
	);
	player.forward.ball.position.z -= 5;
	player.forward.add(player.forward.ball);
	player.forward.material.color.set(0xff0000);
	player.forward.position.z -= 5;
	//player.forward.material.wireframe = true;
	player.forward.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
	player.add(player.forward);

	player.sideways = new THREE.Mesh(
		new THREE.CylinderGeometry(3, 3, 10, 3),
		new THREE.MeshBasicMaterial()
	);
	player.sideways.ball = new THREE.Mesh(
		new THREE.SphereGeometry(1, 10, 10),
		new THREE.MeshBasicMaterial()
	);
	player.sideways.ball.position.x -= 5;
	player.sideways.add(player.sideways.ball);
	player.sideways.material.color.set(0x0000ff);
	player.sideways.position.x -= 5;
	//player.sideways.material.wireframe = true;
	player.sideways.geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(-Math.PI/2));
	player.add(player.sideways);

	player.ball = new THREE.Mesh(
		new THREE.SphereGeometry(1, 10, 10),
		new THREE.MeshBasicMaterial()
	);
	player.add(player.ball);

	player.position.set(0, 0, 0);
	player.scale.set(2, 2, 2);
	scene.add(player);
}
function createRendererInstance() {
	// Create the renderer
	renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
	renderer.setSize(WIDTH, HEIGHT);

	// Enable shadow rendering
	renderer.shadowMap.enabled = true;

	//add the renderer to our world container
	container.appendChild(renderer.domElement);
}
function createClickyShit() {
	document.addEventListener('mousemove', recordMouseMove, false);
	raycaster = new THREE.Raycaster();

	this.keys = [];
	window.onkeyup = function(e) {keys[e.which]=false;}
	window.onkeydown = function(e) {keys[e.which]=true;}
}
function createControls() {
	//console.log("creating controls");

	// Hook pointer lock state change events
	document.addEventListener('pointerlockchange', lockChangeAlert, false);
	document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
	document.addEventListener('webkitpointerlockchange', lockChangeAlert, false);

	// Hook mouse move events
	//document.addEventListener("mousemove", lockedMouseMove, false);

	let havePointerLock = 'pointerLockElement' in document ||
    'mozPointerLockElement' in document ||
    'webkitPointerLockElement' in document;

	let element = container;
	// Ask the browser to lock the pointer
	container.requestPointerLock = container.requestPointerLock ||
			container.mozRequestPointerLock ||
			container.webkitRequestPointerLock;
	container.onclick = () => {container.requestPointerLock();}

	// Ask the browser to release the pointer
	document.exitPointerLock = document.exitPointerLock ||
			document.mozExitPointerLock ||
			document.webkitExitPointerLock;
	document.exitPointerLock();
}
function lockChangeAlert() {
	if (document.pointerLockElement === container ||
  		document.mozPointerLockElement === container ||
  		document.webkitPointerLockElement === container) {
  	// Pointer was just locked, enable the mousemove listener
		container.onclick = null;
  	document.addEventListener("mousemove", lockedMouseMove, false);
	} else {
	  // Pointer was just unlocked, disable the mousemove listener
	  document.removeEventListener("mousemove", lockedMouseMove, false);
		console.log("mouse unlocked");
		console.log(player);
		container.onclick = () => {container.requestPointerLock();}
	  //this.unlockHook(container);
	}
}
function lockedMouseMove(e) {
	//console.log("Locked mouse move");
	var movementX = e.movementX ||
		e.mozMovementX          ||
		e.webkitMovementX       ||
		0;

	var	movementY = e.movementY ||
		e.mozMovementY      ||
		e.webkitMovementY   ||
		0;

	if(movementX != 0) {
		console.log("yaw" + movementX);
		player.rotation.y -= (movementX/100);
	}
	if(movementY != 0) {
		console.log("pitch" + movementY);
		player.rotation.x -= (movementY/100);
	}
}

function update() {
	{
		//update objects
		for (let i = 0; i < scene.objects.length; i++) {
			scene.objects[i].update();
		}

		//update the "player"'s position (and the camera's position)
		movePlayer();
		console.log(player.ball.position.x + " " + player.ball.position.y + " " + player.ball.position.z);
		//console.log(player.forward.ball.position.x + " " + player.forward.ball.position.y + " " + player.forward.ball.position.z);
		camera.position.set(player.ball.position.x, player.ball.position.y, player.ball.position.z);

		camera.rotation.x = player.rotation.x;
		camera.rotation.y = player.rotation.y;


		//update mouse stuff

		//First, we get a ray from two points: mousePos and cameraPos. We draw a ray into our scene
		//Then, the ray sees what objects it intersects as per such: http://imgur.com/UikgfRZ
		raycaster.setFromCamera(mousePos, camera);
		//raycaster.far = camera.far;

		var intersects = raycaster.intersectObjects(scene.children);
		for ( var i = 0; i < intersects.length; i++ ) {
			intersects[i].object.material.color.set(0xff0000);
			//console.log(intersects[i].object);
		}

		//and render the scene
		renderer.render(scene, camera);
		requestAnimationFrame(scene.loop);
	}
}

/**************************************/
/****************other*****************/
var mousePos = new THREE.Vector2();
function recordMouseMove(event) {
	event.preventDefault();
	mousePos.x = (2*(event.clientX / WIDTH) - 1);
	mousePos.y = - ( event.clientY / HEIGHT ) * 2 + 1;
	document.getElementById('mouseStats').innerHTML = "My mouse position is (" + mousePos.x + ", " + mousePos.y + ")";
}

function handleWindowResize() {
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}

function addToMyGame(myObj) {
	scene.objects.push(myObj);
	scene.add(myObj.mesh || null);
	myObj.init();
}

function movePlayer() {
	// let delta = {};
	// for(var n in camera.position) {
	// 	delta[n] = camera.position[n] - centerOfScene[n];
	// }
	// // need three numeric parameters for camera.position.set
	//
	// if (keys[65]) {camera.position.target.x -= camera.moveSpeed;}//left
	// if (keys[87]) {camera.position.target.y += camera.moveSpeed;}//up
	// if (keys[68]) {camera.position.target.x += camera.moveSpeed;}//right
	// if (keys[83]) {camera.position.target.y -= camera.moveSpeed;}//down
	// // //
	// for(var n in camera.position.target) {
	// 	let delta = camera.position.target[n] - camera.position[n];
	// 	let v = delta*.1;
	// 	if(Math.abs(v) < camera.moveSpeed/10) {camera.position.target[n] = camera.position[n];}
	// 	camera.position[n] += v;
	// }
}
