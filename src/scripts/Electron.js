/* global THREE:true, Electron:true */
/* exported Qubit */
class Electron {
    get position() {
        return this.dot.position
    }

    constructor(dot) {
        this.dot = dot;
        
        const electronMaterial = new THREE.MeshBasicMaterial({color: 0xff0000})
        const electronGeometry = new THREE.IcosahedronGeometry(Electron.RADIUS * Qubit.QUBIT_THICK / 2, 1)

        this.object = new THREE.Mesh(electronGeometry, electronMaterial)
        this.object.geometry.translate(dot.position.x, dot.position.y, dot.position.z)


        if (!Electron.instances)
            Electron.instances = []
        Electron.instances.push(this)

        this.charge = 1.0
    }
}

Electron.RADIUS = 0.8
Electron.INFLUENCE_SIZE = 1000.0