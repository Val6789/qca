/*
    global
    Block
    ParticleSystem
*/
/*
    exported InputBlock
*/


class InputBlock extends Block {

    get balance() {
        return this.polarity
    }

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


    processNeighboorsInfluences() {}

    constructor(position, polarity, strength = 4) {
        if (polarity == 0) throw console.error("Input block cannot have zero values")
        polarity = Math.sign(polarity)

        super(position)

        this.polarity = polarity
        this.charge = strength

        this.type = "input"

        this.object.visible = InputBlock._isVisible

        if (polarity > 0) {
            InputBlock.positiveParticles.addAt(this.position)
            InputBlock.positiveInstances.push(this)
            this.setColor(0x0000ff)
        } else {
            InputBlock.negativeParticles.addAt(this.position)
            InputBlock.negativeInstances.push(this)
            this.setColor(0xffff00)
        }
        
        if(this.polarity == -1)
			this.setLabel("0")
		else if(this.polarity == 1)
			this.setLabel("1")
    }

    static init() {
        InputBlock.positiveParticles = new ParticleSystem(this._getSolidMaterial("positive_input"))
        InputBlock.negativeParticles = new ParticleSystem(this._getSolidMaterial("negative_input"))

        InputBlock.positiveInstances = []
        InputBlock.negativeInstances = []

        InputBlock._isVisible = true
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

    static get isVisible() {
        return InputBlock._isVisible
    }

    static set isVisible(boolean) {
        if (InputBlock._isVisible === boolean) return
        InputBlock._isVisible = boolean
        InputBlock.positiveInstances.forEach( qubit => qubit.object.visible = boolean)
        InputBlock.negativeInstances.forEach( qubit => qubit.object.visible = boolean)
        ThreeViewControllerInstance.shouldRender()
    }
}
