/*
    exported
    ParticleSystem
*/

class ParticleSystem {
    addAt(position) {
        if (this.MAX_POINTS < this._particulesCount * this.ATTRIBUTE_SIZE)
            throw console.warn("No more space in particle system")

        this._setPositionBuffer(position.toArray(), this._particulesCount * this.ATTRIBUTE_SIZE)
    }

    /**
     * @param {Array<THREE.Vector3>} positions
     */
    set positions(positions) {
        this._updateBuffer = positions
    }

    _reloadPositions(positions) {
        if (this.MAX_POINTS < positions.length * this.ATTRIBUTE_SIZE)
            throw console.warn("No more space in particle system")

        let reducedPositionArray = positions.reduce((buffer, position) => buffer.concat(position.toArray()), [])
        this._setPositionBuffer(reducedPositionArray, 0)
    }

    _setPositionBuffer(valuesArray, offset) {
        if ((valuesArray.length + offset) % this.ATTRIBUTE_SIZE != 0)
            throw console.warn(`new values count is not a multiple of attribute size.\n Buffer size: ${valuesArray.length + offset}\n Attribute size: ${this.ATTRIBUTE_SIZE}`)

        this._positionAttributeBuffer.set(valuesArray, offset)
        this._positionAttributeBuffer.needsUpdate = true

        this._particulesCount = (offset + valuesArray.length) / this.ATTRIBUTE_SIZE
        this._geometryBuffer.setDrawRange(0, this._particulesCount)
        this._geometryBuffer.computeBoundingSphere()
    }

    constructor(materials = [], maximumParticlesCount = 1000, attributeSize = 3) {
        this.MAX_POINTS = maximumParticlesCount
        this.ATTRIBUTE_SIZE = attributeSize


        let array = new Float32Array(this.MAX_POINTS * this.ATTRIBUTE_SIZE)
        this._particulesCount = 0

        this._updateBuffer = null

        this._positionAttributeBuffer = new THREE.BufferAttribute(array, this.ATTRIBUTE_SIZE)
        this._geometryBuffer = new THREE.BufferGeometry()
        this._geometryBuffer.dynamic = true
        this._geometryBuffer.addAttribute("position", this._positionAttributeBuffer)
        this._geometryBuffer.setDrawRange(0, 0)
        this._geometryBuffer.computeBoundingSphere()

        this._particlesGroup = new THREE.Group()
        this._particlesGroup.name = "Particles"

        // if only one material was given, turn it into an array
        if (materials instanceof THREE.Material)
            materials = [materials]

        materials.forEach(material => {
            let particles = new THREE.Points(this._geometryBuffer, material)
            this._particlesGroup.add(particles)
        })

        ThreeViewControllerInstance.addObjectToScene(this._particlesGroup)

        ThreeViewControllerInstance.callbackOnRender(() => {
            if (this._updateBuffer) this._reloadPositions(this._updateBuffer)
            this._updateBuffer = null
        })
    }
}