'use strict'

// Global variables
let camera,
  scene,
  renderer,
  controls

let light,
  floor,
  box,
  player


const height = window.innerHeight
const width = window.innerWidth
const movementSpeed = 0.75
const turnSpeed =  Math.PI * 0.01
const cameraHeight = 8
const cameraDistance = -30

init()

function init () {
  // Create a scene
  scene = new THREE.Scene()

  // Create a renderer
  renderer = new THREE.WebGLRenderer()

  renderer.setSize(width, height)
  renderer.setClearColor(0xcccccc);
  renderer.shadowMap.enabled = true;

  // Create a camera
  camera = new THREE.PerspectiveCamera(50, width / height, 1, 1000)

  // Positioning the camera
	camera.position.set(0,cameraHeight, cameraDistance)
	camera.lookAt(new THREE.Vector3(0, cameraHeight, 0))

	// cameraBox.add(camera);

  // Create elements
  light = getPointLight(2)
  floor = getPlane(500)
  box = getBox(5, 5, 5)
  player = getBox(5, 5, 5)
 
  // Positioning of the elements
  floor.rotation.x = Math.PI / 2
  box.position.y = box.geometry.parameters.height * 1.5
  light.position.set(-50, 100, -100)
  player.position.set(0, player.geometry.parameters.height / 2, cameraDistance)

  // Camera follows player
  player.add(camera);

  // Add elements to scene
  scene.add(floor)
  scene.add(box)
  scene.add(light)
  scene.add(player)

  document.body.appendChild(renderer.domElement)
  
  animate()
}

function animate () {
  renderer.render(scene, camera)

  requestAnimationFrame(animate)

  // Box animation
  box.rotation.x += 0.01;
  box.rotation.y += 0.02;

  // Player movement
	if (Key.isDown(Key.W)) {
		player.translateZ(movementSpeed);
	}

	if (Key.isDown(Key.S)) {
		player.translateZ(-movementSpeed);
	}

	if (Key.isDown(Key.A)) {
		player.translateX(movementSpeed);
	}

	if (Key.isDown(Key.D)) {
		player.translateX(-movementSpeed);
	}

	if (Key.isDown(Key.LR)) {
		player.rotation.y += turnSpeed;
	}

	if (Key.isDown(Key.RR)) {
		player.rotation.y -= turnSpeed;
	}
}

// Geometry helpers
function getBox (width, height, depth) {
  const box = new THREE.BoxGeometry(width, height, depth)
  const material = new THREE.MeshPhongMaterial({
    color: 0x822F87
  })

  const mesh = new THREE.Mesh(box, material)
  mesh.castShadow = true

  return mesh
}

function getPlane (size) {
  const plane = new THREE.PlaneGeometry(size, size, size / 20, size / 20)
  const material = new THREE.MeshPhongMaterial({
    color: 0xaaaaaa,
    side: THREE.DoubleSide
  })

  const mesh = new THREE.Mesh(plane, material)
  mesh.receiveShadow = true

  return mesh
}

function getPointLight (intensity) {
  const light = new THREE.PointLight(0xffffff, intensity)
  light.castShadow = true

	return light;
}
