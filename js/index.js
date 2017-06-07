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

	//rows of spheres so that we can more easily see how we handle controls
	for(let r = 0; r < 10; r++) {
		for(let c = 0; c < 15; c++) {
			let n = new Neuron();
			n.mesh.position.x = (-200) + (40*c);
			n.mesh.position.y = (-100) + (40*r);
			n.mesh.position.z = -300;
			addToMyGame(n);
		}
	}
	for(let r = 0; r < 10; r++) {
		for(let c = 0; c < 15; c++) {
			let n = new Neuron();
			n.mesh.position.x = (-200) + (40*c); //+ (-5 + Math.random()*10);
			n.mesh.position.y = (-100) + (40*r); //(-3 + Math.random()*6);
			n.mesh.position.z = 100;
			addToMyGame(n);
		}
	}


	scene.loop();
}

/**************************************/
/*********create our scene*************/
var container, controls, clock;
function createScene() {
	clock = new THREE.Clock();
	container = document.getElementById('world');	//We have our container be any HTML DOM object

	//For now, we want the width and height of our global window object. But later, we might want our entire THREE.js scene to reside in a different spot
	container.innerWidth = this.innerWidth;
	container.innerHeight = this.innerHeight;
  this.WIDTH = container.innerWidth;	//these are useful to write down
	this.HEIGHT = container.innerHeight;

	createSceneInstance();
	createCameraInstance();
	createRendererInstance();
	createMouseRecording();
	createControls();

	//If the user resizes it we have to update the camera and the renderer size
	window.addEventListener('resize', handleWindowResize, false);
}

/**************************************/
/********init helper functions*********/
var scene, camera, renderer, centerOfScene,
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
function createMouseRecording() {
	document.addEventListener('mousemove', recordMouseMove, false);
	raycaster = new THREE.Raycaster();
}
function createControls() {
	this.controls = new THREE.FirstPersonControls(camera);
	controls.movementSpeed = 500;
	controls.lookSpeed = 0.1;

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
		//console.log("yaw" + movementX);
		//player.rotation.y -= (movementX/100);
	}
	if(movementY != 0) {
		//console.log("pitch" + movementY);
		//player.rotation.x -= (movementY/100);
	}
}

function update() {
	{
		var delta = clock.getDelta();
		var time = clock.getElapsedTime() * 10;

		//update objects
		for (let i = 0; i < scene.objects.length; i++) {
			scene.objects[i].update();
		}




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
		//update the "player"'s position (and the camera's position)
		//movePlayer();
		controls.update(delta);
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

	controls.handleResize();
}

function addToMyGame(myObj) {
	scene.objects.push(myObj);
	scene.add(myObj.mesh || null);
	myObj.init();
}
