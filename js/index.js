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
var container;
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
}



function update() {
	{
		//update objects
		for (let i = 0; i < scene.objects.length; i++) {
			scene.objects[i].update();
		}

		//update mouse stuff

		//First, we get a ray from two points: mousePos and cameraPos. We draw a ray into our scene
		//Then, the ray sees what objects it intersects as per such: http://imgur.com/UikgfRZ
		raycaster.setFromCamera(mousePos, camera);
		raycaster.far = camera.far;

		var intersects = raycaster.intersectObjects(scene.children);
		for ( var i = 0; i < intersects.length; i++ ) {
			let myId = intersects[i].object.myId;
			let myObj = scene.objects[myId];
			myObj.mouseOver();
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
	mousePos.x = (2*(event.clientX / WIDTH) - 1);
	mousePos.y = (2*(event.clientY / HEIGHT) - 1) * -1;
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
