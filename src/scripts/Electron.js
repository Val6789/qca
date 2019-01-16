/* global THREE:true */
/* exported Electron */

class Electron {
    get position() {
        return this.dot.position
    }

    static init() {
        return new Promise((resolve) => {

            // init the instances object
            Electron.instances = []

            // create the buffer for the geometry
            const MAX_POINTS = 1000

            // geometry
            Electron.geometry = new THREE.BufferGeometry()
            Electron.geometry.dynamic = true

            // attributes
            let positions = new Float32Array(MAX_POINTS * 3)
            let buffer = new THREE.BufferAttribute(positions, 3)
            Electron.geometry.addAttribute("position", buffer)

            // load and setup the sprite
            const textureLoader = new THREE.TextureLoader()
                .setCrossOrigin(true)
            const file = "assets/textures/dot.png"
            textureLoader.load(
                file,
                (sprite) => {
                    const material = new THREE.PointsMaterial({
                        size: 0.5,
                        sizeAttenuation: true,
                        map: sprite,
                        transparent: true,
                        alphaTest: 0.8
                    })
                    material.color.setHSL(0.1, 0.3, 0.7)

                    const particles = new THREE.Points(Electron.geometry, material)
                    resolve(particles)
                },
                undefined,
                (err) => console.error(err)
            )
        })
    }

    static recreate() {
        let index = 0
        Electron.instances.forEach((e) => {

            const x = e.dot.position.x
            const y = e.dot.position.y
            const z = e.dot.position.z
            var positions = Electron.geometry.attributes.position.array
            positions[index++] = x
            positions[index++] = y
            positions[index++] = z

        })
        Electron.geometry.setDrawRange(0, Electron.instances.length)
        Electron.geometry.attributes.position.needsUpdate = true
        Electron.geometry.computeBoundingSphere()
        Electron.needsUpdate = false
    }

    constructor(dot) {
        this.dot = dot
        this.charge = 1.0

        const x = dot.position.x
        const y = dot.position.y
        const z = dot.position.z
        var positions = Electron.geometry.attributes.position.array
        let i = Electron.instances.length * 3
        positions[i + 0] = x
        positions[i + 1] = y
        positions[i + 2] = z
        Electron.geometry.setDrawRange(0, i + 1)
        Electron.geometry.attributes.position.needsUpdate = true
        Electron.geometry.computeBoundingSphere()

        Electron.instances.push(this)
        Electron.needsUpdate = true
    }
}

Electron.RADIUS = 0.8
Electron.INFLUENCE_SIZE = 1000.0
Electron.needsUpdate = false
