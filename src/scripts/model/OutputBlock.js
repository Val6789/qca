/*
    global Qubit
*/
/*
    exported OutputBlock
*/

class OutputBlock extends Qubit {

    remove() {
        OutputBlock.instances.delete(this)
        AppControllerInstance.view.removeObjectFromScene(this.kitten)
        super.remove()
    }

    _setPolarity(newValue) {
        // returns true if polarity changed
        if (!super._setPolarity(newValue)) return false

        //
        // SET KITTEN STATE
        //
        console.log("cat is alive", newValue)

        return true
    }

    constructor(position) {
        super(position, 0, false)
        this.type = "output"
        this.setLabel("?")
        this.setSublabel("out")

        OutputBlock.instances.add(this)
        this.object.scale.copy(InputBlock.BLOCK_SCALING)
        this.family.material.opacity = 0.95

        this.kitten = OutputBlock._cuteKittyQuantumCat()
        this.kitten.position.copy((new THREE.Vector3()).addVectors(position, position.clone().add(new THREE.Vector3(-0.001,0,-0.001)).setLength(2)))
        this.kitten.lookAt(0,position.y,0)
        this.kitten.visible = OutputBlock._areKittensVisible
        AppControllerInstance.view.addObjectToScene(this.kitten)

        this.DEFAULT_COLOR = "#333"
        this._showFamilyColor(Qubit.areFamilyColorsVisible)
    }

    static _cuteKittyQuantumCat() {
        const geometry = new THREE.BoxGeometry(2,3,2)
        //material ...
        return new THREE.Mesh(geometry)
    }

    static get areKittensVisible() {
        return OutputBlock._areKittensVisible
    }

    static set areKittensVisible(boolean) {
        OutputBlock._areKittensVisible = boolean
        OutputBlock.instances.forEach(block => {
            block.kitten.visible = boolean
        })
    }
}

OutputBlock.instances = new Set()
OutputBlock.BLOCK_SCALING = new THREE.Vector3(1.2,2,1.2)
OutputBlock._areKittensVisible = false