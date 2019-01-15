/* global THREE:true */
/* exported orbit */

let renderer,
  scene,
  camera,
  ambiantLight,
  directionalLight,
  earth,
  orbit

let earthURL = "https://cdn-images-1.medium.com/max/800/1*UlLoXKAJcg7pqhjucMaksQ.png"
earthURL = "../images/textures/earth.jpg"
const textureLoader = new THREE.TextureLoader().setCrossOrigin(true)

const innerWidth = window.innerWidth - 100
const innerHeight = window.innerHeight - 300

init()
animate()

window.scene = scene

async function init() {
  renderer = new THREE.WebGLRenderer()

  renderer.setSize(innerWidth, innerHeight)
  document.body.appendChild(renderer.domElement)

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 1, 1000)
  camera.position.set(0, 0, 15)
  scene.add(camera)

  ambiantLight = new THREE.AmbientLight(0x969696)
  directionalLight = new THREE.DirectionalLight(0xfdfcf0, 1)
  directionalLight.position.set(20, 10, 20)
  scene.add(ambiantLight)
  scene.add(directionalLight)


  var color = new THREE.Color(1, 0, 0)

  var earthGeometry = new THREE.SphereGeometry(5, 50, 50)
  var earthTexture = await waitTexture(earthURL)
  var earthMaterial
  if (earthTexture) {
    earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      color: 0xaaaaaa,
      specular: 0x333333,
      shininess: 15
    })
  } else {
    earthMaterial = new THREE.MeshLambertMaterial({
      color: color
    })
  }
  console.log(earthTexture)
  console.log(earthMaterial)

  earth = new THREE.Mesh(earthGeometry, earthMaterial)

  scene.add(earth)

  orbit = new THREE.OrbitControls(camera, renderer.domElement)
}

function animate() {

  //earth.rotation.y += .0015

  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

function waitTexture(path) {
  return new Promise((resolve) => {
    textureLoader.load(
      path,
      (texture) => {
        resolve(texture)
      },
      undefined,
      (err) => {
        console.error(err)
        resolve(null)
      })
  })
}
