/*
    global Qubit
*/
/*
    exported OutputBlock
*/

class OutputBlock extends Qubit {

    remove() {
        OutputBlock.instances.delete(this)
        // meow meow
        AppControllerInstance.view.removeObjectFromScene(this.kittenAlive)
        AppControllerInstance.view.removeObjectFromScene(this.kittenDead)
        super.remove()
    }

    _setPolarity(newValue) {
        // returns true if polarity changed
        if (!super._setPolarity(newValue)) return false
        // meow meow
        this._updateKittenState()
        return true
    }

    /**
     * @brief meowmeowmeow meow
     */
    _updateKittenState() {
        // meow
        this.kittenDead.visible = OutputBlock._areKittensVisible && this.polarity <= 0
        this.kittenAlive.visible = OutputBlock._areKittensVisible && this.polarity >= 0
        this.kittenAlive.material.opacity = (this.polarity == 0) ? 0.5 : 1
        this.kittenDead.material.opacity = (this.polarity == 0) ? 0.5 : 1
    }

    constructor(position) {
        super(position, 0, false)
        this.type = "output"
        this.setLabel("?")
        this.setSublabel("out")

        OutputBlock.instances.add(this)
        this.object.scale.copy(InputBlock.BLOCK_SCALING)
        this.family.material.opacity = 0.95


        // meow meow
        this.kittenAlive = OutputBlock._cuteKittyQuantumCatAlive()
        this.kittenAlive.position.copy(OutputBlock._cuteKittyQuantumCatPosition(position))
        this.kittenAlive.position.y -= 0.15 // fix floating cats
        this.kittenAlive.lookAt(0,position.y,0)
        AppControllerInstance.view.addObjectToScene(this.kittenAlive)

        // meowmeow meow
        this.kittenDead = OutputBlock._cuteKittyQuantumCatDead()
        this.kittenDead.position.copy(OutputBlock._cuteKittyQuantumCatPosition(position))
        this.kittenDead.position.y -= 0.15 // fix floating cats
        this.kittenDead.lookAt(0,position.y,0)
        AppControllerInstance.view.addObjectToScene(this.kittenDead)

        // meow
        this._updateKittenState()

        this.DEFAULT_COLOR = "#333"
        this._showFamilyColor(Qubit.areFamilyColorsVisible)
    }

    static _cuteKittyQuantumCatAlive() {
        var newCuteKittyCat = new THREE.Group()
        newCuteKittyCat = AssetManager.Get().models["alivecat"].children[0].clone()
        newCuteKittyCat.material = new THREE.MeshStandardMaterial({
            transparent: true,
            metalness: 0.3,
            roughness: 0.9,
            color: 0x0000ff
        })
        newCuteKittyCat.material.transparent = true
        return newCuteKittyCat
    }
    static _cuteKittyQuantumCatDead() {
        var newCuteKittyCat = new THREE.Group()
        newCuteKittyCat = AssetManager.Get().models["deadcat"].children[0].clone()
        newCuteKittyCat.material = new THREE.MeshStandardMaterial({
            transparent: true,
            metalness: 0.3,
            roughness: 0.9,
            color: 0xffffff00
        })
        newCuteKittyCat.material.transparent = true
        return newCuteKittyCat
    }

    /**
     * @brief meow
     * @param {meow} meow 
     */
    static _cuteKittyQuantumCatPosition(position) {
        // meow meow
        // meow meow meow meow meow meow meow meow
        return (new THREE.Vector3()).addVectors(
            position,
            position.clone().add(new THREE.Vector3(-0.001,0,-0.001)).setLength(2)
        )
    }

    // meow
    static get areKittensVisible() {
        return OutputBlock._areKittensVisible
    }

    /**
     * @brief meow
     * @param {meow} meow
     */
    static set areKittensVisible(boolean) {
        OutputBlock._areKittensVisible = boolean
        // meow
        OutputBlock.instances.forEach(block => block._updateKittenState())
    }
}

OutputBlock.instances = new Set()
OutputBlock.BLOCK_SCALING = new THREE.Vector3(1.2,2,1.2)
OutputBlock._areKittensVisible = false