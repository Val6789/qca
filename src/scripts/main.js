var threeController = new ThreeViewController("viewport")
threeController.startRenderLoop()
threeController.addCube(0,0,1)

document.addEventListener("click", ev => {
    threeController.addCube(Math.random()*4,Math.random()*4,Math.random())
})
