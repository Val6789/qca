class ThreeViewController {

    startRenderLoop() {
        this.isRendering = true
        requestAnimationFrame(() => { this.renderLoop() })
    }


    stopRenderLoop() {
        this.isRendering = false
    }


    // method called on every frame
    renderLoop() {
        if (this.isRendering)
            requestAnimationFrame(() => { this.renderLoop() })

        // print image
        this.renderer.render(this.scene, this.camera)
    }


    // updates renderer parameters if the view changes.
    onViewportResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize( window.innerWidth, window.innerHeight )
    }
    

    constructor(canvasId) {
        // boolean state enabling the render loop to be called every frame
        this.isRendering = false;

        // defines an empty set of objects to render
        this.meshes = []
        
        // initialize perspective camera
        // params: Field of view, Aspect ratio, near field and far field.
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 )

        // initialize 3D scene
        this.scene = new THREE.Sene()


        // initialize renderer
        this.renderer = new THREE.WebGLRenderer( { antialias: true } )

        // use the device's pixel ratio (number of actual / physical screen pixels in one 'virtual' pixel: can be more than one on high res screens) 
        this.renderer.setPixelRatio( window.devicePixelRatio )

        // pixels dimentions of the viewport
        this.renderer.setSize( window.innerWidth, window.innerHeight )
        
        // listen for viewport size changes
        this.renderer.element.addEventListener("resize", ev => { this.onViewportResize() })

        // inserts the WebGl canvas in the document
        document.querySelector(canvasId).appendChild(this.renderer.element)
    }
}