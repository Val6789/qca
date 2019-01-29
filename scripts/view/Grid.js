/* global THREE:true, */
/* exported Grid */

class Grid {
    constructor(font, offset = 0, size = 300, divisions = 300) {
        this.object = new THREE.GridHelper(size, divisions)
        this.object.position.set(-0.5, offset, -0.5)

        this.hitzone = new THREE.Mesh(new THREE.PlaneGeometry(size, size))
        this.hitzone.lookAt(0, 1, 0)
        this.hitzone.material.visible = false
        this.object.add(this.hitzone)

        const material = new THREE.LineBasicMaterial({
            color: 0xffffff,
            opacity: 0.1,
            transparent: true
        })

        this.object.material = material
    }
}
