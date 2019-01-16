/* global THREE:true, AssetManager:true */
/* exported Dot */
class Dot {
    get position() {
        return new THREE.Vector3(
            this.relativeQubitPosition.x + this.parentQubit.position.x,
            this.parentQubit.position.y,
            this.relativeQubitPosition.y + this.parentQubit.position.z
        )
    }

    static init() {
        // init the instances object
        Dot.instances = []

        // create the buffer for the geometry
        const MAX_POINTS = 1000

        // geometry
        Dot.geometry = new THREE.BufferGeometry()
        Dot.geometry.dynamic = true

        // attributes
        let positions = new Float32Array(MAX_POINTS * 3)
        let buffer = new THREE.BufferAttribute(positions, 3)
        Dot.geometry.addAttribute("position", buffer)

        // load and setup the sprite
        const circle = AssetManager.Get().textures.circle
        const material = new THREE.PointsMaterial({
            size: 0.5,
            sizeAttenuation: true,
            map: circle,
            transparent: true,
            alphaTest: 0.8
        })
        material.color.setHSL(0.1, 0.3, 0.7)

        return new THREE.Points(Dot.geometry, material)
    }

    static recreate() {
        let index = 0
        Dot.instances.forEach((e) => {

            const pos = e.position
            const x = pos.x
            const y = pos.y
            const z = pos.z
            var positions = Dot.geometry.attributes.position.array
            positions[index++] = x
            positions[index++] = y
            positions[index++] = z

        })
        Dot.geometry.setDrawRange(0, Dot.instances.length)
        Dot.geometry.attributes.position.needsUpdate = true
        Dot.geometry.computeBoundingSphere()
        Dot.needsUpdate = false
    }

    constructor(x, y, qubit) {
        this.relativeQubitPosition = new THREE.Vector2(x, y)
        this.parentQubit = qubit

        const pos = this.position
        const px = pos.x
        const py = pos.y
        const pz = pos.z
        var positions = Dot.geometry.attributes.position.array
        let i = Dot.instances.length * 3
        positions[i + 0] = px
        positions[i + 1] = py
        positions[i + 2] = pz
        Dot.geometry.setDrawRange(0, i + 1)
        Dot.geometry.attributes.position.needsUpdate = true
        Dot.geometry.computeBoundingSphere()

        Dot.instances.push(this)
        Dot.needsUpdate = true
    }
}

Dot.RADIUS = 0.9
Dot.needsUpdate = false
