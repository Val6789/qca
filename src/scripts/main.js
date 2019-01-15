/* global ThreeViewController:true, DotDescriptor:true, THREE:true */
/* exported orbit */

var threeController = new ThreeViewController("viewport")
threeController.startRenderLoop()
threeController.addCube(1, 1, 1, 0.5)



// document.addEventListener("click", () => {
//   threeController.addCube(Math.random() * 4, Math.random() * 4, Math.random())
// })

function randomData() {
  let d = []
  let cpt = 0
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let p = new THREE.Vector3(i * 2, 0, j * 2)
      let c = new THREE.Color(0.8, 0.3, 0.2)
      d[cpt] = new DotDescriptor(p, c)
      d[cpt].addElectron(new THREE.Vector3(THREE.Math.randFloat(-1, 1), 0, THREE.Math.randFloat(-1, 1)))
      d[cpt].addElectron(new THREE.Vector3(THREE.Math.randFloat(-1, 1), 0, THREE.Math.randFloat(-1, 1)))
      cpt++
    }
  }
  return d
}