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

        AppControllerInstance.view.removeObjectFromScene(this.kitten)
        if(newValue < 0) {
            this.kitten = this.kittenDead
        }
        else {
            this.kitten = this.kittenAlive
        }
        AppControllerInstance.view.addObjectToScene(this.kitten)

        return true
    }


    resetPolarity() {
        this.balance = 0
        this._setPolarity(0)
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

        this.kittenAlive = OutputBlock._cuteKittyQuantumCatAlive()
        this.kittenAlive.position.copy((new THREE.Vector3()).addVectors(position, position.clone().add(new THREE.Vector3(-0.001,0,-0.001)).setLength(2)))
        this.kittenAlive.lookAt(0,position.y,0)
        this.kittenAlive.visible = OutputBlock._areKittensVisible

        this.kittenDead = OutputBlock._cuteKittyQuantumCatDead()
        this.kittenDead.position.copy((new THREE.Vector3()).addVectors(position, position.clone().add(new THREE.Vector3(-0.001,0,-0.001)).setLength(2)))
        this.kittenDead.lookAt(0,position.y,0)
        this.kittenDead.visible = OutputBlock._areKittensVisible

        this.kitten = this.kittenAlive

        AppControllerInstance.view.addObjectToScene(this.kitten)

        this.DEFAULT_COLOR = "#333"
        this._showFamilyColor(Qubit.areFamilyColorsVisible)
    }

    static _cuteKittyQuantumCatAlive() {
        var newCuteKittyCat = new THREE.Group()
        newCuteKittyCat = AssetManager.Get().models["alivecat"].clone()
        return newCuteKittyCat
    }
    static _cuteKittyQuantumCatDead() {
        var newCuteKittyCat = new THREE.Group()
        newCuteKittyCat = AssetManager.Get().models["deadcat"].clone()
        return newCuteKittyCat
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