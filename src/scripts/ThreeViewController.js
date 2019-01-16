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
    }


    /**
     * @brief suggests controller to render the scene soon
     * @warning never call _render directly!
     * Will request render for the next frame or do nothing if this was already done
     */
    shouldRender() {
        if (this._willRender) return
        requestAnimationFrame(_render)
        this._willRender = true
    }


    // Private method rendering the scenes after calling the observers
    _render() {
        this.onRenderObservers.forEach(callback => callback());
        this._renderer.render(this._scene, this._camera)
        this._willRender = false
    }


    // Initialize Camera and Orbit members
    _setCamera() {
        this._camera = new THREE.PerspectiveCamera(70, 1, 0.1, 1000)
        this._camera.position.z

        this._orbit = new THREE.OrbitControls(this._camera)
        this.orbitControls.addEventListener("change", () => {
            this._render()
        })

        window.addEventListener("resize", event => {
            let width = this.renderer.domElement.parentElement.clientWidth
            let height = this.renderer.domElement.parentElement.clientHeight

            this._camera.aspect = width / height
            this._camera.updateProjectionMatrix()
            this._renderer.setSize(width, height)
        })
    }


    // initialize scene member
    _setScene() {
        this._scene = new THREE.Scene()
    }


    // Singleton constructor
    static _init() {
        // Properties
        this._camera
        this._scene
        this._renderer
        this._orbit
        this._willRender = false
        
        this.onRenderObservers

        const viewportElementId = "viewport"


        this._setCamera()
        this._setScene()

        let parent = document.getElementById(viewportElementId)
        parent.appendChild(this._renderer.domElement)
    }


    constructor() {
        if (!ThreeViewController.instance)
            ThreeViewController.instance = this
        else 
            this._init()
        return ThreeViewController.instance
    }
}


const ThreeViewControllerInstance = new Singleton()
Object.freeze(instance)

