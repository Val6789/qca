/* 
    global 
    ThreeViewControllerInstance
    Electron
    ParticleSystem
*/
/* 
    exported 
    IntroScene
*/

class IntroScene {
    constructor(callbackDone) {
        this.callbackDone = callbackDone
        this._scene = new THREE.Scene()

        let pos = new THREE.Vector3(0, 0, 0)
        var elecs = new ParticleSystem([Electron._getSolidMaterial(), Electron._getInfluenceMaterial()])
        elecs.addAt(pos)

        this._scene.add(elecs._particlesGroup)
    }

    /**
     * @brief called by the main instance to add the layer here
     * @param {*} layer 
     */
    setLayer(layer) {
        this.layer = layer
    }

    setCamera(camera) {
        this._camera = camera
    }
}