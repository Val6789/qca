/* 
    global
    THREE
    Skybox
    Axis
 */
/* 
    exported 
    ThreeViewController
    ThreeViewControllerInstance
 */

/**
 * CLASS ThreeViewController
 * @brief Threejs librairy facade
 * - Manages the renders, scene and camera.
 * - Provides methods to suggest render, add objects to a scene 
 *   and to listen to the next render
 * @warning never call _render directly, use shouldRender
 */
class ThreeViewController {

    /**
     * @brief Scene getter
     */
    get scene() {
        return this._scene
    }


    /**
     * @brief Camera getter
     */
    get camera() {
        return this._camera
    }


    /**
     * @brief Orbit getter
     */
    get orbitControls() {
        return this._orbit
    }

    /**
     * @brief Renderer getter
     */
    get renderer() {
        return this._renderer
    }


    /**
     * @brief adds observer method to the render-observers-collection
     * @param {Function} callback method called on render 
     */
    callbackOnRender(callback) {
        this._onRenderObservers.push(callback)
    }


    /**
     * @brief Does what's on the tin: adds a three object3D to the scene
     * @param {THREE.Object3D} object 
     */
    addObjectToScene(object) {
        this._scene.add(object)
        this.shouldRender()
    }


    /**
     * @brief Removes object from scene
     * @param {THREE.Object3D} object 
     */
    removeObjectFromScene(object) {
        this._scene.remove(object)
        this.shouldRender()
    }

    addLayer(scene, camera) {
        this._layers.push({
            scene: scene,
            camera: camera,
            active: true
        })
    }


    /**
     * @brief suggests controller to render the scene soon
     * @warning never call _render directly!
     * Will request render for the next frame or do nothing if this was already done
     */
    shouldRender() {
        if (this._willRender == true) return
        requestAnimationFrame(() => {
            this._render()
            this._willRender = false
        })
        this._willRender = true
    }


    /**
     * @brief class initializer, to be called after DOM and Asset loading 
     */
    init() {
        // Members
        this._camera
        this._orbit
        this._scene
        this._renderer
        this._willRender = false
        this._onRenderObservers = []
        this._skybox

        // init members
        this._createLayers()
        this._setSkybox()
        this._setScene()
        this._setCamera()
        this.addLayer(this._scene, this._camera)
        this._setRenderer()
        this._setOrbit()
        setLightmode(false)

        // add axes
        this._axis = new Axis(this._camera)
    }


    /** 
     * @brief Private method rendering the scenes after calling the observers 
     */
    _render() {
        this._onRenderObservers.forEach(callback => callback())

        this._renderer.render(this._scene, this._camera)
        this._axis.render(this._camera, this._orbit)

        this._layers.forEach((l) => {
            try {
                this._renderer.render(l.scene, l.camera)
            } catch (e) {
                console.log(l)
                console.error(e)
            }
        })


    }


    /**
     *  @brief Private method. Informs the renderer of aspect ratio changes
     */
    _resetViewport() {
        const parent = this._renderer.domElement.parentElement
        const width = parent.clientWidth
        const height = parent.clientHeight

        this._camera.aspect = width / height
        this._camera.updateProjectionMatrix()
        this._renderer.setSize(width, height)

        // show updates
        this.shouldRender()
    }

    _createLayers() {
        this._layers = []
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

        // update camera and render when user resizes the window
        window.addEventListener("resize", () => {
            this._resetViewport()
        })
    }


    /**
     * @brief Scene initialize
     */
    _setScene() {
        // doesn't do much really
        this._scene = new THREE.Scene()
    }

    /**
     * @brief Renderer initializer
     */
    _setRenderer() {
        const viewportElementId = "viewport"

        // set renderer
        this._renderer = new THREE.WebGLRenderer({ antialias: true })
        this._renderer.setPixelRatio(window.devicePixelRatio)
        this._renderer.autoClear = false

        // insert in DOM
        document.getElementById(viewportElementId).appendChild(this._renderer.domElement)
        this._resetViewport()
    }


    /**
     * @brief Orbital camera control initializer
     */
    _setOrbit() {
        this._orbit = new THREE.OrbitControls(this._camera)

        this._orbit.minDistance = 0.75
        this._orbit.maxDistance = 25

        // render on camera movements
        this._orbit.addEventListener("change", () => {
            this._render()
        })
    }

    /**
     * @brief Skybox initializer
     */
    _setSkybox() {
        this._skybox = new Skybox()
        console.log(this._skybox)
        console.log(this._skybox.sceneDark)
        this.addLayer(this._skybox.sceneDark, this._skybox.camera)
        this.addLayer(this._skybox.sceneLight, this._skybox.camera)
    }


    /**
     * @brief Singleton constructor
     */
    constructor() {
        if (!ThreeViewController.instance) {
            ThreeViewController.instance = this
        }

        return ThreeViewController.instance
    }
}

const ThreeViewControllerInstance = new ThreeViewController()
