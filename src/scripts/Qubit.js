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
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true
        })
        const cubeGeometry = new THREE.BoxGeometry(Qubit.QUBIT_SIZE, Qubit.QUBIT_THICK, Qubit.QUBIT_SIZE)

        this.object = new THREE.Mesh(cubeGeometry, wireframeMaterial)

        var self = this
        this.dots = [
            new Dot(1, 1, self),
            new Dot(-1, 1, self),
            new Dot(1, -1, self),
            new Dot(-1, -1, self)
        ]
        this.dots.forEach(dot => this.object.add(dot.object))

        let dots = this.dots
        this.electrons = [
            new Electron(dots[1]),
            new Electron(dots[2])
        ]
        this.electrons.forEach(electron => this.object.add(electron.object))

        this.object.scale.set(Qubit.SCALE, Qubit.SCALE, Qubit.SCALE)
    }
}
Qubit.QUBIT_SIZE = 3
Qubit.QUBIT_THICK = 1
Qubit.SCALE = 0.2