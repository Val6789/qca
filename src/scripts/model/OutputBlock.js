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
        this.object.visible = OutputBlock._isVisible
        OutputBlock.instances.add(this)
    }
}

OutputBlock.instances = new Set()