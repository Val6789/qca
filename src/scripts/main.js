// force  remove of the overlay (for livereload)
if (AppControllerInstance.isReady) AppControllerInstance.show()

// start the app
AppControllerInstance.init().then(() => {
    AppControllerInstance.startUpdateLoop()
    AppControllerInstance.ready()
    var test = new Bridge(new Qubit(new THREE.Vector3(0,0,0)))
    setTimeout(() => test.destination = new Qubit(new THREE.Vector3(3,1,3)), 4000)
})

