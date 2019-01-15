class Dot {
    get position() {
        return new THREE.Vector3(
            this.relativeQubitPosition.x + this.parentQubit.position.x,
            this.parentQubit.position.y,
            this.relativeQubitPosition.y + this.parentQubit.position.z
        )
    }

    constructor(x, y, qubit) {
        const wireframeMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true})
        const dotGeometry = new THREE.IcosahedronGeometry(Dot.RADIUS, 0)
        

        this.relativeQubitPosition = new THREE.Vector2(x,y)
        this.parentQubit = qubit

        this.object = new THREE.Mesh(dotGeometry, wireframeMaterial)
        const self = this;
        this.object.geometry.translate(self.position.x, self.position.y, self.position.z)
    }
}

Dot.RADIUS = 0.3