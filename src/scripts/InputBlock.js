class InputBlock extends Block{
    remove() {
        super.remove()
        if (this.polarity > 0) {
            InputBlock.positiveInstances.splice(InputBlock.positiveInstances.indexOf(this), 1)
            InputBlock.positiveParticles.positions = InputBlock.positiveInstances.map(block => block.position)
        } else {
            InputBlock.negativeInstances.splice(InputBlock.negativeInstances.indexOf(this), 1)
            InputBlock.negativeParticles.positions = InputBlock.negativeInstances.map(block => block.position)
        }
    }


    processNeighboorsInfluences() {
        return this.polarity;
    }

    constructor(position, polarity) {
        if (polarity == 0) throw console.error("Input block cannot have zero values")

        super(position)

        this.polarity = polarity

        if (polarity > 0) {
            InputBlock.positiveParticles.addAt(this.position)  
            InputBlock.positiveInstances.push(this)
        } else {
            InputBlock.negativeParticles.addAt(this.position)  
            InputBlock.negativeInstances.push(this)
        }
    }

    static init() {
        InputBlock.positiveParticles = new ParticleSystem(this._getSolidMaterial("positive_input"))
        InputBlock.negativeParticles = new ParticleSystem(this._getSolidMaterial("negative_input"))

        InputBlock.positiveInstances = []
        InputBlock.negativeInstances = []

        InputBlock.particlesNeedUpdate = 0
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