/* global THREE:true , Electron:true, Qubit:true, Dot */
/* exported ThreeViewController */

class ThreeViewController {

    startRenderLoop() {
        this.isRendering = true
        requestAnimationFrame(() => {
            this.renderLoop()
        })
    }

    stopRenderLoop() {
        this.isRendering = false
    }

    addCube(x = 0, y = 0, z = 0, radius = 1) {
        let geometry = new THREE.BoxGeometry(radius, radius, radius)
        let material = new THREE.MeshBasicMaterial({
            color: 0x00ff00
        })
        let mesh = new THREE.Mesh(geometry, material)
        mesh.matrix.position = THREE.Vector3(x, y, z)
        mesh.updateMatrix()
        this.scene.add(mesh)
    }

    addObject(object) {
        this.scene.add(object)
    }

    addSkybox() {
        const path = "assets/textures/skybox/"
        const format = ".png"
        const createUrl = (name) => path + name + format
        const urls = [
            createUrl("right"),
            createUrl("left"),
            createUrl("top"),
            createUrl("bottom"),
            createUrl("back"),
            createUrl("front")
        ]

        let reflectionCubeTexture
        this.waitTexture(urls)
            .then((texture) => {
                reflectionCubeTexture = texture
                reflectionCubeTexture.format = THREE.RGBFormat

                let shader = THREE.ShaderLib["cube"]
                shader.uniforms["tCube"].value = reflectionCubeTexture

                let material = new THREE.ShaderMaterial({
                    fragmentShader: shader.fragmentShader,
                    vertexShader: shader.vertexShader,
                    uniforms: shader.uniforms,
                    depthWrite: false,
                    side: THREE.BackSide
                })

                const s = 500
                let mesh = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), material)
                mesh.name = "Skybox"
                this.scene.add(mesh)

                // Fix, cause the skybox takes time to load
                this.render()

            })
            .catch((err) => {
                console.error(err)
            })

    }

    getFont() {
        if (this.fontCache) {
            return Promise.resolve(this.fontCache)
        } else {
            var self = this
            return new Promise((resolve, reject) => {
                const FONT_FILE_PATH = "assets/fonts/optimer_regular.typeface.json"
                new THREE.FontLoader().load(FONT_FILE_PATH, (font) => {
                    self.fontCache = font
                    resolve(self.fontCache)
                }, undefined, reject)
            })
        }
    }

    waitTexture(path) {
        return new Promise((resolve, reject) => {
            if (Array.isArray(path))
                this.cubeLoader.load(
                    path,
                    (texture) => resolve(texture),
                    undefined,
                    (err) => {
                        console.error(err)
                        reject(err)
                    }
                )
            else
                this.textureLoader.load(
                    path,
                    (texture) => resolve(texture),
                    undefined,
                    (err) => {
                        console.error(err)
                        reject(err)
                    }
                )
        })
    }


    /* "Private" methods */

    // method called on every frame
    renderLoop() {
        if (this.isRendering)
            requestAnimationFrame(() => {
                this.renderLoop()
            })
        // Display Loop
        this.render()
    }

    update() {
        if (this.grid)
            this.grid.lookCamera(this.camera.position)

        for (let callback of this.onRenderObservers)
            callback()
        
        if ( Electron.needsUpdate )
            Electron.recreate()     
        
        if ( Dot.needsUpdate )
            Dot.recreate()       
    }
    
    render() {
        this.update()
        this.renderer.render(this.scene, this.camera)
    }

    // updates renderer parameters if the view changes.
    updateViewport() {
        let width = this.renderer.domElement.parentElement.clientWidth
        let height = this.renderer.domElement.parentElement.clientHeight

        this.camera.aspect = width / height
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
        this.camera = new THREE.PerspectiveCamera(70, 1, 0.1, 1000)
        this.camera.position.z = 5

        // initialize 3D scene
        this.scene = new THREE.Scene()

        // initialize renderer
        this.renderer = new THREE.WebGLRenderer()

        // use the device's pixel ratio (number of actual / physical screen pixels in one 'virtual' pixel: can be more than one on high res screens) 
        this.renderer.setPixelRatio(window.devicePixelRatio)

        // initialize texture Loader
        this.textureLoader = new THREE.TextureLoader()
            .setCrossOrigin(true)

        this.cubeLoader = new THREE.CubeTextureLoader()
            .setCrossOrigin(true)

        // Add two lights
        var ambiant = new THREE.AmbientLight(0xffffff)
        this.scene.add(ambiant)

        var point = new THREE.PointLight(0xffffff, 2)
        this.scene.add(point)

        // Create the skybox
        this.addSkybox()


        // inserts the WebGl canvas in the document
        parent.appendChild(this.renderer.domElement)
        this.updateViewport()

        // listen for viewport size changes
        window.addEventListener("resize", () => {
            this.updateViewport()
        })

        // create camera orbit controls
        this.orbitControls = new THREE.OrbitControls(this.camera)
        this.orbitControls.addEventListener("change", () => {
            this.render()
        })

        this.scene.fog = new THREE.FogExp2(0x000000, 0.005)

        this.onRenderObservers = []
        
        // Create the particles of the Qubit
        let particlesDot = Dot.init(this.scene)
        particlesDot.then((p) => {
            this.scene.add(p)
            this.render()
        })

        // Create the particles of the electrons
        let particlesElectron = Electron.init(this.scene)
        particlesElectron.then((p) => {
            this.scene.add(p)
            this.render()
        })
    }
}
