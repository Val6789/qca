/* global THREE:true, AssetManager:true */
/* exported Dot */

class Dot {

    // computed value
    get position() {
        return (new THREE.Vector3).addVectors(this.relativeQubitPosition, this.parentQubit.position)
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
        const dotImage = AssetManager.Get().textures.dot
        const material = new THREE.PointsMaterial({
            size: 0.5,
            sizeAttenuation: true,
            map: dotImage,
            transparent: true,
            alphaTest: 0.5
        })

        ThreeViewControllerInstance.callbackOnRender(() => {
            if (Dot.needsUpdate) Dot.recreate()
        })

        Dot.dotContourOverlay = new THREE.Points(Dot.geometry, material)
        ThreeViewControllerInstance.addObjectToScene(Dot.dotContourOverlay)
    }

    static recreate() {
        var positions = Dot.geometry.attributes.position.array
        Dot.instances.forEach((electron, bufferindex) => {
            const position = electron.position
            positions[bufferindex * 3 + 0] = position.x
            positions[bufferindex * 3 + 1] = position.y
            positions[bufferindex * 3 + 2] = position.z
        })

        Dot.geometry.setDrawRange(0, Dot.instances.length)
        Dot.geometry.attributes.position.needsUpdate = true
        Dot.geometry.computeBoundingSphere()
        Dot.needsUpdate = false
    }

    constructor(offsetX, offsetZ, qubit) {
        this.relativeQubitPosition = new THREE.Vector3(offsetX, 0, offsetZ)
        this.parentQubit = qubit
        
        var positions = Dot.geometry.attributes.position.array
        let i = Dot.instances.length * 3

        const position = this.position
        positions[i + 0] = position.x
        positions[i + 1] = position.y
        positions[i + 2] = position.z

        Dot.geometry.setDrawRange(0, i + 1)
        Dot.geometry.attributes.position.needsUpdate = true
        Dot.geometry.computeBoundingSphere()

        Dot.instances.push(this)
        Dot.needsUpdate = true
    }
}

Dot.RADIUS = 0.9
Dot.needsUpdate = false
