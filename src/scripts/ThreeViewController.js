/* 
    global
    THREE
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


    /**
     * @brief suggests controller to render the scene soon
     * @warning never call _render directly!
     * Will request render for the next frame or do nothing if this was already done
     */
    shouldRender() {
        if (this._willRender == true) return
        requestAnimationFrame(() => this._render())
        this._willRender = true
    }


	/**
	 * @brief set light/dark mode
	 * @param mode true = light, false = dark
	 */
	setLightmode(mode) {
		this.lightMode = mode
		
		//~ const skybox = this.scene.getObjectByName("Skybox")
		//~ this.scene.remove(skybox)
		
		if(this.lightMode)
		{
			//~ this.addSkybox("_light")
			this.scene.fog = new THREE.FogExp2(0xffffff, 0.005)
			document.body.classList.remove("mode-dark")
			document.body.classList.add("mode-light")
		}
		else
		{
			//~ this.addSkybox()
			this.scene.fog = new THREE.FogExp2(0x000000, 0.005)
			document.body.classList.remove("mode-light")
			document.body.classList.add("mode-dark")
		}
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

        // init members
        this._setScene()
        this._setCamera()
        this._setRenderer()
        this._setOrbit()
        this.setLightmode(false)
    }


    // Private method rendering the scenes after calling the observers
    _render() {
        this._onRenderObservers.forEach(callback => callback())
        this._renderer.render(this._scene, this._camera)
        this._willRender = false
    }


    // Reset viewport parameters when the window is resized
    _resetViewport() {
        const parent = this._renderer.domElement.parentElement
        const width = parent.clientWidth
        const height = parent.clientHeight

        this._camera.aspect = width / height
        this._camera.updateProjectionMatrix()
        this._renderer.setSize(width, height)
    }


    // Initialize Camera and Orbit members
    _setCamera() {
        const fieldOfView = 70
        const nearField = 0.1
        const farField = 1000

        this._camera = new THREE.PerspectiveCamera(fieldOfView, 1, nearField, farField)

        this._camera.position.x = 5
        this._camera.position.y = 8

        window.addEventListener("resize", () => {
            this._resetViewport()
        })
    }


    // initialize scene member
    _setScene() {
        this._scene = new THREE.Scene()
    }

    // initialize renderer member
    _setRenderer() {
        const viewportElementId = "viewport"

        // set renderer
        this._renderer = new THREE.WebGLRenderer()
        this._renderer.setPixelRatio(window.devicePixelRatio)

        // insert in DOM
        document.getElementById(viewportElementId).appendChild(this._renderer.domElement)
        this._resetViewport()
    }

    // initialize orbit
    _setOrbit() {
        this._orbit = new THREE.OrbitControls(this._camera)
        this._orbit = new THREE.OrbitControls(this.camera)
        this._orbit.minDistance = 0.75;
        this._orbit.maxDistance = 25;

        this._orbit.addEventListener("change", () => {
            this._render()
        })
    }


    constructor() {
        if (!ThreeViewController.instance) {
            ThreeViewController.instance = this
        }

        return ThreeViewController.instance
    }
}

const ThreeViewControllerInstance = new ThreeViewController()
