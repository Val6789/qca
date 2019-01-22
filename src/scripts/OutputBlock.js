class OutputBlock extends Qubit {

    remove() {
        OutputBlock.instances.remove(this)
        super.remove()
    }

    constructor(position) {
        super(position, 0, false)
        this.type = "output"
        this.object.visible = OutputBlock._isVisible
        OutputBlock.instances.add(this)
    }

    static get isVisible() {
        return OutputBlock._isVisible
    }

    static set isVisible(boolean) {
        OutputBlock._isVisible = boolean
        OutputBlock.instances.map( block => block.object.visible = boolean)
    }
}

OutputBlock.instances = new Set()
OutputBlock._isVisible = true