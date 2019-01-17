class InputBlock {

    get position() {
        return this.object.position;
    }

    constructor(position, polarity) {
        if (polarity == 0) throw console.error("Input block cannot have zero values")
        this.polarity = polarity

        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff })
        const cubeGeometry = new THREE.BoxGeometry(Qubit.QUBIT_SIZE, Qubit.QUBIT_THICK, Qubit.QUBIT_SIZE)
        const edgesGeometry = new THREE.EdgesGeometry(cubeGeometry)

        // create object and move it
        this.object = new THREE.LineSegments(edgesGeometry, lineMaterial)
        this.object.translateX(position.x)
        this.object.translateZ(position.z)

        if (polarity > 0) {
            InputBlock.positiveParticles.addAt(this.position)  
            InputBlock.positiveInstances.push(this)
        } else {
            InputBlock.negativeParticles.addAt(this.position)  
            InputBlock.negativeInstances.push(this)
        }

        ThreeViewControllerInstance.addObjectToScene(this.object)
    }

    static init() {
        InputBlock.positiveParticles = new ParticleSystem(this._getSolidMaterial("positive_input"))
        InputBlock.negativeParticles = new ParticleSystem(this._getSolidMaterial("negative_input"))

        InputBlock.positiveInstances = []
        InputBlock.negativeInstances = []
    }

    static _getSolidMaterial(textureName) {
        return new THREE.PointsMaterial({
            size: 0.7,
            sizeAttenuation: true,
            map: AssetManager.Get().textures[textureName],
            transparent: false,
            alphaTest: 0.1
        })
    }
}