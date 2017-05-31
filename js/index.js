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
	//var myNeuron = new Neuron(scene);
	addToMyGame(new Neuron());

	//add the listener
	document.addEventListener('mousemove', recordMouseMove, false);

	// start a loop that will update the objects' positions
	// and render the scene on each frame
	scene.update();
}

function addToMyGame(myObj) {
	scene.objects.push(myObj);
	scene.add(myObj.mesh || null);
}

/**************************************/
/*********create our scene*************/
var scene,
		camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH,
		renderer, container;
function createScene() {
	// Get the width and the height of the screen,
	// use them to set up the aspect ratio of the camera
	// and the size of the renderer.
  WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight;

	scene = new THREE.Scene(); // Create the scene
	// Add a fog effect to the scene; same color as the
	// background color used in the style sheet
	scene.fog = new THREE.Fog(0xf7d9aa, 100, 1150);

	scene.objects = [];
	scene.update = () => {
		for (let i = 0; i < scene.objects.length; i++) {
			console.log(scene.objects[i]);
	  	scene.objects[i].update(scene);
		}
		// render the scene
		renderer.render(scene, camera);
		requestAnimationFrame(scene.update);
	}

	// Create the camera
	aspectRatio = WIDTH / HEIGHT;
	fieldOfView = 60;
	nearPlane = 1;
	farPlane = 10000;
	camera = new THREE.PerspectiveCamera(
		fieldOfView,
		aspectRatio,
		nearPlane,
		farPlane
	);

	// Set the position of the camera
	camera.position.x = 0;
	camera.position.z = 200;
	camera.position.y = 100;

	// Create the renderer
	renderer = new THREE.WebGLRenderer({
		// Allow transparency to show the gradient background we defined in the CSS
		alpha: true,

		// Activate the anti-aliasing; this is less performant,
		// but, as our project is low-poly based, it should be fine :)
		antialias: true
	});

	// Define the size of the renderer; in this case,
	// it will fill the entire screen
	renderer.setSize(WIDTH, HEIGHT);

	// Enable shadow rendering
	renderer.shadowMap.enabled = true;

	// Add the DOM element of the renderer to the
	// container we created in the HTML
	container = document.getElementById('world');
	container.appendChild(renderer.domElement);

	// Listen to the screen: if the user resizes it we have to update the camera and the renderer size
	window.addEventListener('resize', handleWindowResize, false);
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

function handleWindowResize() {
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}

/**************************************/
/****************other*****************/
var mousePos={x:0, y:0};
function recordMouseMove(event) {
	var tx = -1 + (event.clientX / WIDTH)*2;

	var normalY = -1 + (event.clientY / WIDTH)*2;
	var ty = -1 * normalY;
	mousePos = {x:tx, y:ty};
}
