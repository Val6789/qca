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
        const MAX_POINTS = 1000
        
        // geometry
        Electron.geometry = new THREE.BufferGeometry()
        Electron.geometry.dynamic = true
        
        // attributes
        let positions = new Float32Array( MAX_POINTS * 3)
        let buffer = new THREE.BufferAttribute(positions, 3)
        Electron.geometry.addAttribute("position", buffer)

        // load and setup the sprite
        const textureLoader = new THREE.TextureLoader()
            .setCrossOrigin(true)
        const file = "assets/textures/disc.png"
        const spritePromise = await textureLoader.load(file)
        console.log(spritePromise)

        const material = new THREE.PointsMaterial({
            size: 0.1,
            sizeAttenuation: true,
            map: spritePromise,
            transparent: true,
            alphaTest: 0.5
        })
        material.color.setHSL(0.1, 0.3, 0.7)
        

        //var material = new THREE.PointsMaterial( { color: 0x2222ff } )
        
        const particles = new THREE.Points(Electron.geometry, material)
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
        var positions = Electron.geometry.attributes.position.array
        let i = Electron.instances.length
        positions[i + 0] = x
        positions[i + 1] = y
        positions[i + 2] = z
        console.log(positions)
        Electron.geometry.setDrawRange(0, i+1)
        Electron.geometry.attributes.position.needsUpdate = true
        Electron.geometry.computeBoundingSphere()

        Electron.instances.push(this)
    }
}

Electron.RADIUS = 0.8
Electron.INFLUENCE_SIZE = 1000.0
