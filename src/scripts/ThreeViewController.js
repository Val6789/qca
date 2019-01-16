/* global THREE:true , Electron:true, Qubit:true, Dot */
/* exported ThreeViewController */

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
     * @brief adds observer method to the render-observers-collection
     * @param {Function} callback method called on render 
     */
    callbackOnRender(callback) {
        this.onRenderObservers.push(callback)    
    }


    /**
     * @brief Does what's on the tin: adds a three object3D to the scene
     * @param {THREE.Object3D} object 
     */
    addObjectToScene(object) {
        this._scene.add(object)
        this.shouldRender()
    }


    /**
     * @brief suggests controller to render the scene soon
     * @warning never call _render directly!
     * Will request render for the next frame or do nothing if this was already done
     */
    shouldRender() {
        if (this._willRender == false) return
        requestAnimationFrame(this._render)
        this._willRender = true
    }


    // Private method rendering the scenes after calling the observers
    _render() {
        this.onRenderObservers.forEach(callback => callback());
        this._renderer.render(this._scene, this._camera)
        this._willRender = false
    }


    // Reset viewport parameters when the window is resized
    _resetViewport() {
        const parent = this._renderer.domElement
        const width = parent.clientWidth
        const height = parent.clientHeight

        this._camera.aspect = width / height
        this._camera.updateProjectionMatrix()
        this._renderer.setSize(width, height)
    }


    // Initialize Camera and Orbit members
    _setCamera() {
        this._camera = new THREE.PerspectiveCamera(70, 1, 0.1, 1000)
        this._camera.position.z

        this._orbit = new THREE.OrbitControls(this._camera)

        this._orbit.addEventListener("change", () => {
            this._render()
        })

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
        document.addEventListener("load", () => {
            let parent = document.getElementById(viewportElementId)
            parent.appendChild(this._renderer.domElement)
            this._resetViewport()
        })
    }

    // Singleton constructor
    _init() {
        // Members
        this._camera
        this._scene
        this._renderer
        this._orbit
        this._willRender = false        
        this._onRenderObservers

        // init members
        this._setRenderer()
        this._setCamera()
        this._setScene()
    }


    constructor() {
        if (!ThreeViewController.instance) {
            ThreeViewController.instance = this
            this._init()
        }           

        return ThreeViewController.instance
    }
}


const ThreeViewControllerInstance = new ThreeViewController()
Object.freeze(ThreeViewControllerInstance)

