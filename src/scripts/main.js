/* global ThreeViewController:true */
/* exported orbit */

var threeController = new ThreeViewController("viewport")
threeController.startRenderLoop()
threeController.addCube(1, 1, 1, 0.5)

document.addEventListener("click", () => {
  threeController.addCube(Math.random() * 4, Math.random() * 4, Math.random())
})