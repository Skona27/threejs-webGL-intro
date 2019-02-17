'use strict'

// Global variables
let camera,
  scene,
  renderer,
  controls

let light,
  floor,
  box

let prevTime = performance.now()
let velocity = new THREE.Vector3()
let direction = new THREE.Vector3()

const height = window.innerHeight
const width = window.innerWidth
const movementSpeed = 500
const movementDelay = 9
const blockerDiv = document.querySelector('#blocker')

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

  // Create a controls
  controls = new THREE.PointerLockControls(camera, renderer.domElement)
  controls.getObject().position.set(50, 10, 50)

  // Event listeners for mouse control
  blockerDiv.addEventListener('click', function () {
    controls.lock()
  })

  controls.addEventListener('lock', function () {
    blockerDiv.style.display = 'none'
  })

  controls.addEventListener('unlock', function () {
    blockerDiv.style.display = 'block'
  })

  // Create elements
  light = getPointLight(2)
  floor = getPlane(500)
  box = getBox(5, 5, 5)
 
  // Positioning of the elements
  floor.rotation.x = Math.PI / 2
  // box.position.y = box.geometry.parameters.height / 2
  box.position.y = box.geometry.parameters.height * 2
  box.position.z = 20
  box.position.x = 50
  light.position.set(100, 100, 100)

  // Add elements to scene
  scene.add(floor)
  scene.add(box)
  scene.add(light)
  scene.add(controls.getObject())

  document.body.appendChild(renderer.domElement)
  
  animate()
}

function animate () {
  renderer.render(scene, camera)

  requestAnimationFrame(animate)

  // Process logic
  if (controls.isLocked === true) {

    // Box animation
    box.rotation.x += 0.01;
	  box.rotation.y += 0.02;

    // Movement logic
    const time = performance.now()
    let delta = ( time - prevTime ) / 1000
    
    velocity.x -= velocity.x * movementDelay * delta
    velocity.z -= velocity.z * movementDelay * delta

    // WASD events
    if (Key.isDown(Key.W)) {
      velocity.z -= movementSpeed * delta
    }

    if (Key.isDown(Key.S)) {
      velocity.z += movementSpeed * delta
    }

    if (Key.isDown(Key.A)) {
      velocity.x -= movementSpeed * delta
    }

    if (Key.isDown(Key.D)) {
      velocity.x += movementSpeed * delta
    }
      
    // Camera movement
    controls.getObject().translateX( velocity.x * delta )
    controls.getObject().translateZ( velocity.z * delta )

    prevTime = time;
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
