/* global THREE:true, Dot:true, Electron:true */
/* exported Qubit */

class Qubit {
    get position() {
        return this.object.position
    }

    move(x, z) {
        this.object.translateX(x)
        this.object.translateZ(z)
    }

    constructor() {
        const lineMaterial = new THREE.MeshBasicMaterial({color: 0xffffff})
        const cubeGeometry = new THREE.BoxGeometry(Qubit.QUBIT_SIZE, Qubit.QUBIT_THICK, Qubit.QUBIT_SIZE)
        const edgesGeometry = new THREE.EdgesGeometry(cubeGeometry)

        this.object = new THREE.LineSegments(edgesGeometry, lineMaterial)

        var self = this
        this.dots = [
            new Dot(Qubit.DOT_DIST, Qubit.DOT_DIST, self),
            new Dot(-Qubit.DOT_DIST, Qubit.DOT_DIST, self),
            new Dot(Qubit.DOT_DIST, -Qubit.DOT_DIST, self),
            new Dot(-Qubit.DOT_DIST, -Qubit.DOT_DIST, self)
        ]
        this.dots.forEach(dot => this.object.add(dot.object))

        let dots = this.dots
        this.electrons = [
            new Electron(dots[1]),
            new Electron(dots[2])
        ]
        this.electrons.forEach(electron => this.object.add(electron.object))
    }
}

Qubit.DOT_DIST = 0.2
Qubit.QUBIT_SIZE = 0.8
Qubit.QUBIT_THICK = 0.3
