'use strict'

// Global variables
let camera,
  scene,
  renderer,
  controls

let light,
  floor,
  firstBox,
  secondBox,
  player

let obstacles = []

const height = window.innerHeight
const width = window.innerWidth
let movementSpeed = 0.08
const turnSpeed =  Math.PI * 0.008
const cameraHeight = 2
const cameraDistance = -5

init()

function init () {
  // Create a scene
  scene = new THREE.Scene()

  // Create a renderer
  renderer = new THREE.WebGLRenderer()

  renderer.setSize(width, height)
  renderer.setClearColor(0xcccccc)
  renderer.shadowMap.enabled = true

  // Create a camera
  camera = new THREE.PerspectiveCamera(50, width / height, 1, 1000)

  // Positioning the camera
	camera.position.set(0,cameraHeight, cameraDistance)
	camera.lookAt(new THREE.Vector3(0, cameraHeight, 0))

  // Create elements
  light = getPointLight(2)
  floor = getPlane(50)
  firstBox = getBox(3, 3, 3)
  secondBox = getBox(3, 3, 3)
  player = getBox(1, 1, 1, 0x27ae60)
 
  // Positioning of the elements
  light.position.set(-2, 10, -10)
  floor.rotation.x = Math.PI / 2
  firstBox.position.set(4, firstBox.geometry.parameters.height / 2, 0)
  secondBox.position.set(-4, secondBox.geometry.parameters.height / 2, 0)
  player.position.set(0, player.geometry.parameters.height / 2, cameraDistance)

  // Camera follows player
  player.add(camera)

  // Add elements to scene
  scene.add(light)
  scene.add(floor)
  scene.add(firstBox)
  scene.add(secondBox)
  scene.add(player)

  // Add scene obstacles
  obstacles.push(firstBox)
  obstacles.push(secondBox)

  document.body.appendChild(renderer.domElement)
  
  animate()
}

function animate () {
  renderer.render(scene, camera)

  requestAnimationFrame(animate)

  // Collision detection
  for (let i = 0; i < player.geometry.vertices.length; i++) {		
    // Position and direction vectors
    const localVertex = player.geometry.vertices[i].clone()
    const globalVertex = localVertex.applyMatrix4(player.matrix)
    const directionVector = globalVertex.sub(player.position)
    
    // Raycaster scanning in movement direction
    const raycaster = new THREE.Raycaster(player.position, directionVector.clone().normalize())
    const intersections = raycaster.intersectObjects(obstacles)
 
		if (intersections.length > 0 && intersections[0].distance < directionVector.length()) {
      // Move backwards or forwards
      if (i === 0 || i === 1 || i === 7) {
        player.translateZ(-movementSpeed)
      } else if (i === 3 || i === 4 || i === 5) {
        player.translateZ(movementSpeed)
      }
      // Move to left or right
      if (i === 1 || i === 2 || i === 3) {
        player.translateX(-movementSpeed)
      } else if (i === 5 || i === 6 || i === 7) {
        player.translateX(movementSpeed)
      }
    }
  }	

  // Player movement
	if (Key.isDown(Key.W)) {
		player.translateZ(movementSpeed)
	}

	if (Key.isDown(Key.S)) {
		player.translateZ(-movementSpeed)
	}

	if (Key.isDown(Key.A)) {
		player.translateX(movementSpeed)
	}

	if (Key.isDown(Key.D)) {
		player.translateX(-movementSpeed)
	}

	if (Key.isDown(Key.LR)) {
		player.rotation.y += turnSpeed
	}

	if (Key.isDown(Key.RR)) {
		player.rotation.y -= turnSpeed
  }
}

// Geometry helpers
function getBox (width, height, depth, color = 0x822F87) {
  const box = new THREE.BoxGeometry(width, height, depth)
  const material = new THREE.MeshPhongMaterial({ color })

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

	return light
}
