/* global THREE:true, AssetManager:true */
/* exported Dot */

class Dot {

    // computed value
    get position() {
        return (new THREE.Vector3).addVectors(this.relativeQubitPosition, this.parentQubit.position)
    }

    constructor(offsetX, offsetZ, qubit) {
        // properties
        this.relativeQubitPosition = new THREE.Vector3(offsetX, 0, offsetZ)
        this.parentQubit = qubit
        
        // add particle for the new dot
        Dot.particles.addAt(this.position)

        // push dot in the instance collection
        Dot.instances.push(this)
    }

    static init() {
        // init the instances object
        Dot.instances = []

        // create particle system
        Dot.particles = new ParticleSystem(Dot._getSolidMaterial())

        // add callback on render to check for updates
        ThreeViewControllerInstance.callbackOnRender(() => {
            if (Dot.needsUpdate) Dot.particles.reloadPositions(Dot.instances.map(dot => dot.position))
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
