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
		n.mesh.position.y = (0); + //(-3 + Math.random()*6);

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
	createCameraInstance();
	createRendererInstance();
	createClickyShit();
	createControls();

	//If the user resizes it we have to update the camera and the renderer size
	window.addEventListener('resize', handleWindowResize, false);
}

/**************************************/
/********init helper functions*********/
var scene, camera, renderer,
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

	let centerOfScene = {x: 0, y: 0, z: 0};
	// need three numeric parameters for camera.position.set
	// Make sure to move the camera back 200 units from the center of the scene so we can actually see
	camera.position.set(centerOfScene.x, centerOfScene.y, centerOfScene.z + 200);
	camera.lookAt(new THREE.Vector3(centerOfScene.x, centerOfScene.y, centerOfScene.z));
	//need a THREE.Vector3 object as a parameter for camera.lookAt

	camera.moveSpeed = 3;
	camera.position.target = {};
	camera.position.target.x = centerOfScene.x;
	camera.position.target.y = centerOfScene.y;
	camera.position.target.z = centerOfScene.z+200;
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
	document.addEventListener('pointerlockchange', pointerLockChange, false);
	document.addEventListener('mozpointerlockchange', pointerLockChange, false);
	document.addEventListener('webkitpointerlockchange', pointerLockChange, false);

	// Hook mouse move events
	//document.addEventListener("mousemove", lockedMouseMove, false);

	let havePointerLock = 'pointerLockElement' in document ||
    'mozPointerLockElement' in document ||
    'webkitPointerLockElement' in document;

	console.log(havePointerLock + " is what I say about pointer lock.");

	let element = container;
	// Ask the browser to lock the pointer
	element.requestPointerLock = element.requestPointerLock ||
			element.mozRequestPointerLock ||
			element.webkitRequestPointerLock;
	console.log(element.requestPointerLock);
	element.requestPointerLock();

	// // Ask the browser to release the pointer
	// document.exitPointerLock = document.exitPointerLock ||
	// 		document.mozExitPointerLock ||
	// 		document.webkitExitPointerLock;
	// document.exitPointerLock();
}
function pointerLockChange() {
	console.log("I am happy");
	if (document.pointerLockElement === requestedElement ||
  		document.mozPointerLockElement === requestedElement ||
  		document.webkitPointerLockElement === requestedElement) {
  	// Pointer was just locked, enable the mousemove listener
  	document.addEventListener("mousemove", lockedMouseMove, false);
	} else {
		console.log("what is unlock hook");
	  // Pointer was just unlocked, disable the mousemove listener
	  document.removeEventListener("mousemove", lockedMouseMove, false);
	  this.unlockHook(this.element);
	}
}
function lockedMouseMove(e) {
	console.log("locked mouse move");

	var movementX = e.movementX ||
		e.mozMovementX          ||
		e.webkitMovementX       ||
		0;

	var	movementY = e.movementY ||
		e.mozMovementY      ||
		e.webkitMovementY   ||
		0;
}

function update() {
	{
		//update objects
		for (let i = 0; i < scene.objects.length; i++) {
			scene.objects[i].update();
		}

		//update camera
		moveCamera();

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

function moveCamera() {
	if (keys[65]) {camera.position.target.x -= camera.moveSpeed;}
	if (keys[87]) {camera.position.target.y += camera.moveSpeed;}
	if (keys[68]) {camera.position.target.x += camera.moveSpeed;}
	if (keys[83]) {camera.position.target.y -= camera.moveSpeed;}

	for(var n in camera.position.target) {
		let delta = camera.position.target[n] - camera.position[n];
		let v = delta*.1;
		if(Math.abs(v) < camera.moveSpeed/10) {camera.position.target[n] = camera.position[n];}
		camera.position[n] += v;
	}
}
