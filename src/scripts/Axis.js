/*
	exported
	Axis
*/

/**
 * Shows axes in a corner of the viewport (div #axis)
 */
class Axis {
    constructor(camera) {
        // renderer
        this._renderer = new THREE.WebGLRenderer({
            alpha: true
        })
        this._renderer.setSize(75, 75)
        document.getElementById("axis").appendChild(this._renderer.domElement)

        // scene
        this._scene = new THREE.Scene()

        this._camera = new THREE.PerspectiveCamera(70, 1, 1, 1000)
        this._camera.up = camera.up

        this.object = new THREE.AxesHelper()
        this._scene.add(this.object)
    }

    render() {
        this._renderer.render(this._scene, this._camera)
    }

    update(camera, controls) {
        this._camera.position.copy(camera.position)
        this._camera.position.sub(controls.target)
        this._camera.position.setLength(2)

        this._camera.lookAt(this._scene.position)
    }

    setLayer(layer) {
        this.layer = layer
    }
}