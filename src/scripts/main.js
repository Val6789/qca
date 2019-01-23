// force  remove of the overlay (for livereload)
if (AppControllerInstance.isReady) AppControllerInstance.show()

// start the app
AppControllerInstance.init().then(() => {
    AppControllerInstance.startUpdateLoop()
    AppControllerInstance.ready()
    let test = new BridgeQubit(new THREE.Vector3(0,0,0), 1)
})

