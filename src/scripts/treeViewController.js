class ThreeViewController {

    startRenderLoop() {
        this.isRendering = true
        requestAnimationFrame(() => { this.renderLoop() })
    }


    stopRenderLoop() {
        this.isRendering = false
    }


    addCube(x = 0, y = 0, radius = 1) {
        let geometry = new THREE.BoxBufferGeometry(radius, radius, radius)
        let material = new THREE.LineBasicMaterial({ color: 0xffffff })
        let mesh = new THREE.Mesh(geometry, material)
        this.scene.add(mesh)
    }


    /* "Private" methods */

    // method called on every frame
    renderLoop() {
        var self = this
        if (this.isRendering)
            requestAnimationFrame(() => { this.renderLoop() })

        // print image
        this.renderer.render(self.scene, self.camera)
    }


    // updates renderer parameters if the view changes.
    onViewportResize() {
        this.camera.aspect = parent.clientWidth / parent.clientHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(parent.clientWidth, parent.clientHeight)
    }
    

    constructor(canvasId) {
        // get viewport parent node
        let parent = document.getElementById(canvasId);

        // boolean state enabling the render loop to be called every frame
        this.isRendering = false;
        
        // initialize perspective camera
        // params: Field of view, Aspect ratio, near field and far field.
        this.camera = new THREE.PerspectiveCamera( 70, parent.clientWidth, parent.clientHeight, 1, 1000 )
        this.camera.position.z = -10

        // initialize 3D scene
        this.scene = new THREE.Scene()


        // initialize renderer
        this.renderer = new THREE.WebGLRenderer( { antialias: true } )

        // use the device's pixel ratio (number of actual / physical screen pixels in one 'virtual' pixel: can be more than one on high res screens) 
        this.renderer.setPixelRatio( window.devicePixelRatio )

        // listen for viewport size changes
        window.addEventListener("resize", ev => { this.onViewportResize() })

        // inserts the WebGl canvas in the document
        parent.appendChild(this.renderer.domElement)

        // pixels dimentions of the viewport
        this.renderer.setSize(parent.clientWidth, parent.clientHeight)

    }
}