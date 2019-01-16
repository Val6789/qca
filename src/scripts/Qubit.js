/* global THREE:true, Dot:true, Electron:true */
/* exported Qubit */

class Qubit {
    get position() {
        return this.object.position
    }

    constructor(position = new THREE.Vector3()) {

        // check if place is occupied
        if (Qubit.instances.some(qubit => qubit.position.equals(position)))
            return false

        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff
        })
        const cubeGeometry = new THREE.BoxGeometry(Qubit.QUBIT_SIZE, Qubit.QUBIT_THICK, Qubit.QUBIT_SIZE)
        const edgesGeometry = new THREE.EdgesGeometry(cubeGeometry)

        // create object and move it
        this.object = new THREE.LineSegments(edgesGeometry, lineMaterial)
        this.object.translateX(position.x)
        this.object.translateZ(position.z)

        // create dots
        var self = this
        this.dots = [
            new Dot(Qubit.DOT_DIST, Qubit.DOT_DIST, self),
            new Dot(-Qubit.DOT_DIST, Qubit.DOT_DIST, self),
            new Dot(Qubit.DOT_DIST, -Qubit.DOT_DIST, self),
            new Dot(-Qubit.DOT_DIST, -Qubit.DOT_DIST, self)
        ]

        // create electrons
        let dots = this.dots
        this.electrons = [
            new Electron(dots[1]),
            new Electron(dots[2])
        ]

        Qubit.instances.push(this)
    }
}

Qubit.DOT_DIST = 0.2
Qubit.QUBIT_SIZE = 0.8
Qubit.QUBIT_THICK = 0.3
Qubit.instances = []
