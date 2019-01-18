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

    remove() {
        Dot.instances.splice(Dot.instances.indexOf(this), 1)
        Dot.particles.positions = Dot.instances.map(dot => dot.position)
        ThreeViewControllerInstance.shouldRender()
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
    }

    static _getSolidMaterial() {
        return new THREE.PointsMaterial({
            size: Dot.RADIUS,
            sizeAttenuation: true,
            map: AssetManager.Get().textures.dot,
            transparent: true,
            alphaTest: 0.5
        })
    }
}

Dot.RADIUS = 0.3
Dot._bufferNeedsUpdate = false