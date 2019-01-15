/* global ThreeViewController:true, DotDescriptor:true, THREE:true */
/* exported orbit */

var threeController = new ThreeViewController("viewport")
threeController.startRenderLoop()
//threeController.addCube(1, 1, 1, 0.5)

let d1 = new DotDescriptor(new THREE.Vector3(0, 0, 0), new THREE.Color(0.8, 0.3, 0.2))
d1.addElectron(new THREE.Vector3(-1, 0, -1))
d1.addElectron(new THREE.Vector3(1, 0, 1))
threeController.addDot(d1)

d1.position = new THREE.Vector3(2, 0, 0)
threeController.addDot(d1)

d1.position = new THREE.Vector3(4, 0, 0)
threeController.addDot(d1)


// document.addEventListener("click", () => {
//   threeController.addCube(Math.random() * 4, Math.random() * 4, Math.random())
// })