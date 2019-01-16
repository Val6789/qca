/* global THREE:true */
/* exported Electron */

class Electron {
    get position() {
        return this.dot.position
    }

    static async init() {
        // init the instances object
        Electron.instances = []

        // create the buffer for the geometry
        let geometry = new THREE.BufferGeometry()
        Electron.buffer = new THREE.Float32BufferAttribute([], 3)
        geometry.addAttribute("position", Electron.buffer)

        // load and setup the sprite
        this.textureLoader = new THREE.TextureLoader()
            .setCrossOrigin(true)
        const file = "assets/textures/disc.png"
        const sprite = await this.waitTexture(file)
        const material = new THREE.PointsMaterial({
            size: 500,
            sizeAttenuation: true,
            map: sprite
        })
        material.color.setHSL(1.0, 0.3, 0.7)

        const particles = new THREE.Points(geometry, material)
        return particles
    }

    constructor(dot) {
        this.dot = dot
        this.charge = 1.0

        /*
        const electronMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000
        })
        const electronGeometry = new THREE.IcosahedronGeometry(Electron.RADIUS * Qubit.QUBIT_THICK / 2, 1)
        
        this.object = new THREE.Mesh(electronGeometry, electronMaterial)
        this.object.geometry.translate(dot.position.x, dot.position.y, dot.position.z)
        */
        const x = this.position.x
        const y = this.position.y
        const z = this.position.z
        Electron.buffer.setXYZ(Electron.instances.length, x, y, z)

        Electron.instances.push(this)
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
}

Electron.RADIUS = 0.8
Electron.INFLUENCE_SIZE = 1000.0
Electron.init()
