/*
    global
    Block
    ParticleSystem
*/
/*
    exported InputBlock
*/


class InputBlock extends Block {

    // returns the binary state
    get state() {
        const polarity = this.polarity
        if (polarity == 1 || polarity == -1) return polarity
        else return NaN
    }

    get balance() {
        return this.polarity
    }

    remove() {
        super.remove()
        if (this.polarity > 0) {
            InputBlock.positiveInstances.splice(InputBlock.positiveInstances.indexOf(this), 1)
        } else {
            InputBlock.negativeInstances.splice(InputBlock.negativeInstances.indexOf(this), 1)
        }
    }


    processNeighboorsInfluences() {}

    constructor(position, polarity, strength = 1) {
        if (polarity == 0) throw console.error("Input block cannot have zero values")
        polarity = Math.sign(polarity)

        super(position)

        this.polarity = polarity
        this.charge = strength
        this.type = "input"

        if (polarity > 0) {
            InputBlock.positiveInstances.push(this)
            this.setColor(0x0000ff)
            this.setLabel("1")
        } else {
            InputBlock.negativeInstances.push(this)
            this.setColor(0xffff00)
            this.setLabel("0")
        }

        this.DEFAULT_COLOR = "#333"
        this._showFamilyColor(false)

        this.bufferBalance = polarity

        this.setSublabel("in")

        this.object.scale.copy(InputBlock.BLOCK_SCALING)
        this.family.material.opacity = 0.9
    }

    static init() {
        InputBlock.positiveInstances = []
        InputBlock.negativeInstances = []
        InputBlock.BLOCK_SCALING = new THREE.Vector3(1.2,2,1.2)
    }
}
