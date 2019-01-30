/*
    global
    ParticleSystem
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
        if (!this.isVisible) return
        Dot.visibleInstances.splice(Dot.visibleInstances.indexOf(this), 1)
        Dot.particles.positions = Dot.visibleInstances.map(dot => dot.position)
        AppControllerInstance.view.shouldRender()
    }

    constructor(relativePosition, qubit, visible = false) {
        // properties
        this.relativeQubitPosition = relativePosition
        this.parentQubit = qubit

        this.isVisible = visible
        if (visible) {
            // add particle for the new dot
            Dot.particles.addAt(this.position)
            // push dot in the instance collection
            Dot.visibleInstances.push(this)
        }
    }

    static init() {
        // init the instances object
        Dot.visibleInstances = []

        // create particle system
        Dot.particles = new ParticleSystem(Dot._getSolidMaterial())
        AppControllerInstance.view
            .addObjectToScene(Dot.particles.object)
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
