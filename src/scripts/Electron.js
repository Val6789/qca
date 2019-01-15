/* global THREE:true, Electron:true */
/* exported Qubit */
class Electron {
    get position() {
        return this.dot.position
    }

    constructor(dot) {
        this.dot = dot

        const electronMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000
        })
        const electronGeometry = new THREE.SphereGeometry(Electron.RADIUS, 12, 6)

        this.object = new THREE.Mesh(electronGeometry, electronMaterial)
        this.object.geometry.translate(dot.position.x, dot.position.y, dot.position.z)


        if (!Electron.instances)
            Electron.instances = []
        Electron.instances.push(this)
    }
}

Electron.RADIUS = 0.38