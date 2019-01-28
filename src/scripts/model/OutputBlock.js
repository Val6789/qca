/*
    global Qubit
*/
/*
    exported OutputBlock
*/

class OutputBlock extends Qubit {

    remove() {
        OutputBlock.instances.delete(this)
        super.remove()
    }

    constructor(position) {
        super(position, 0, false)
        this.type = "output"
        this.setLabel("?")
        this.setSublabel("out")

        OutputBlock.instances.add(this)
        this.object.scale.copy(InputBlock.BLOCK_SCALING)
        this.family.material.opacity = 0.95

        this.DEFAULT_COLOR = "#333"
        this._showFamilyColor(Qubit.areFamilyColorsVisible)
    }
}

OutputBlock.instances = new Set()
OutputBlock.BLOCK_SCALING = new THREE.Vector3(1.2,2,1.2)