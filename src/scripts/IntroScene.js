/* 
    global 
    ThreeViewControllerInstance
*/
/* 
    exported 
    IntroScene
*/

class IntroScene {
    constructor(callbackDone) {
        this.callbackDone = callbackDone
        this._setCamera()
        this._scene = new THREE.Scene()
    }
    /**
     * @brief Call the starting introduction
     */
    _setIntro() {
        return new Promise((resolve) => {
            const intro = new IntroScene(() => {
                resolve()
            })
            let layer = {
                scene: intro.scene,
                camera: intro.camera
            }
            this.addLayer(layer)
            intro.setLayer(layer)
        })
    }

    /**
     * @brief called by the main instance to add the layer here
     * @param {*} layer 
     */
    setLayer(layer) {
        this.layer = layer
    }


    /**
     * @brief Camera initializer
     */
    _setCamera() {
        // constants
        const fieldOfView = 70
        const nearField = 0.1
        const farField = 1000

        this._camera = new THREE.PerspectiveCamera(fieldOfView, 1, nearField, farField)

        this._camera.position.x = 5
        this._camera.position.y = 8
    }
}