class ThreeViewController {

    startRenderLoop() {
        this.isRendering = true
        requestAnimationFrame(() => { this.renderLoop() })
    }


    stopRenderLoop() {
        this.isRendering = false
    }


    addCube(x = 0, y = 0, z = 0, radius = 1) {
        let geometry = new THREE.BoxGeometry(radius, radius, radius)
        let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        let mesh = new THREE.Mesh(geometry, material)
        mesh.matrix.position = THREE.Vector3(x,y,z)
        mesh.updateMatrix()
        this.scene.add(mesh)
    }

    addObject(object) {
        this.scene.add(object)
    }

    /* "Private" methods */

    // method called on every frame
    renderLoop() {
        if (this.isRendering)
            requestAnimationFrame(() => { this.renderLoop() })
        // print image
        this.renderer.render(this.scene, this.camera)
    }


    // updates renderer parameters if the view changes.
    updateViewport() {
        let width = this.renderer.domElement.parentElement.clientWidth
        let height = this.renderer.domElement.parentElement.clientHeight

        this.camera.aspect = width/height
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(width, height)
    }
    

    constructor(canvasId) {
        // get viewport parent node
        let parent = document.getElementById(canvasId)

        // boolean state enabling the render loop to be called every frame
        this.isRendering = false
        
        // initialize perspective camera
        // params: Field of view, Aspect ratio (overwritten late), near field and far field.
        this.camera = new THREE.PerspectiveCamera( 70, 1, 0.1, 1000 )
        this.camera.position.z = 5

        // initialize 3D scene
        this.scene = new THREE.Scene()

        // initialize renderer
        this.renderer = new THREE.WebGLRenderer()

        // use the device's pixel ratio (number of actual / physical screen pixels in one 'virtual' pixel: can be more than one on high res screens) 
        this.renderer.setPixelRatio( window.devicePixelRatio )
        
        // inserts the WebGl canvas in the document
        parent.appendChild(this.renderer.domElement)
        this.updateViewport()

        // listen for viewport size changes
        window.addEventListener("resize", () => { this.updateViewport() })

        // create camera orbit controls
        this.orbitControls = new THREE.OrbitControls(this.camera)
    }
}