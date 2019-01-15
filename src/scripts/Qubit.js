class Qubit {
    get position() {
        return this.object.position
    }

    move(x,z) {
        this.object.translateX(x)
        this.object.translateZ(z)
    }

    constructor() {
        const QUBIT_SIZE = 3;
        const QUBIT_THICK = 1;

        const wireframeMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true})
        const cubeGeometry = new THREE.BoxGeometry(QUBIT_SIZE,QUBIT_THICK,QUBIT_SIZE)
        
        this.object = new THREE.Mesh(cubeGeometry, wireframeMaterial)

        var self = this
        this.dots = [
            new Dot(1,1, self), 
            new Dot(-1,1, self), 
            new Dot(1,-1, self), 
            new Dot(-1,-1, self)
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