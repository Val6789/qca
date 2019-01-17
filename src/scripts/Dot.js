/* 
    global 
    THREE,
    AssetManager,
    ThreeViewControllerInstance
*/
/* 
    exported 
    Dot 
*/

class Dot {

    // computed value
    get position() {
        return (new THREE.Vector3).addVectors(this.relativeQubitPosition, this.parentQubit.position)
    }

    constructor(offsetX, offsetZ, qubit) {
        // properties
        this.relativeQubitPosition = new THREE.Vector3(offsetX, 0, offsetZ)
        this.parentQubit = qubit

        // insert new particle in the geometry attribute buffer
        let attributesBuffer = Dot._particuleGeometryBuffer.getAttribute("position")
        attributesBuffer.set(this.position.toArray(), Dot.instances.length * 3)
        attributesBuffer.needsUpdate = true

        // update buffer size
        Dot._particuleGeometryBuffer.setDrawRange(0, Dot.instances.length + 1)
        Dot._particuleGeometryBuffer.computeBoundingSphere()

        Dot.instances.push(this)
    }

    static _reloadParticuleGeometryBuffer() {
        // makes array of all the values of each position vector
        let positionArray = Dot.instances.reduce((buffer, dot) => buffer.concat(dot.position.toArray()), [])

        // overwrite the geometry buffer with new values
        let attributeBuffer = Dot._particuleGeometryBuffer.getAttribute("position")
        attributeBuffer.set(positionArray, 0)
        attributeBuffer.needsUpdate = true

        // update buffer size
        Dot._particuleGeometryBuffer.setDrawRange(0, Dot.instances.length)
        Dot._particuleGeometryBuffer.computeBoundingSphere()

        // turn off the calling flag
        Dot._bufferNeedsUpdate = false
    }

    static init() {
        // init the instances object
        Dot.instances = []

        // create the buffer for the geometry
        const MAX_POINTS = 1000

        // attributes
        let positions = new Float32Array(MAX_POINTS * 3)
        let buffer = new THREE.BufferAttribute(positions, 3)

        // geometry
        Dot._particuleGeometryBuffer = new THREE.BufferGeometry()
        Dot._particuleGeometryBuffer.dynamic = true
        Dot._particuleGeometryBuffer.addAttribute("position", buffer)

        // add particle system to the scene
        Dot.dotContourOverlay = new THREE.Points(Dot._particuleGeometryBuffer, Dot._getSolidMaterial())
        ThreeViewControllerInstance.addObjectToScene(Dot.dotContourOverlay)

        // add callback on render to check for updates
        ThreeViewControllerInstance.callbackOnRender(() => {
            if (Dot.needsUpdate) Dot._reloadParticuleGeometryBuffer()
        })
    }

    static _getSolidMaterial() {
        return new THREE.PointsMaterial({
            size: 0.5,
            sizeAttenuation: true,
            map: AssetManager.Get().textures.dot,
            transparent: true,
            alphaTest: 0.5
        })
    }
}

Dot.RADIUS = 0.9
Dot._bufferNeedsUpdate = false