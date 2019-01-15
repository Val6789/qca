/* global ThreeViewController:true */
/* exported orbit */

var threeController = new ThreeViewController("viewport")
threeController.startRenderLoop()
threeController.addCube(0, 0, 1)
threeController.addCube(0, 3, 2)

document.addEventListener("click", () => {
  threeController.addCube(Math.random() * 4, Math.random() * 4, Math.random())
})