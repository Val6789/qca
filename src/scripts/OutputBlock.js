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

    static get isVisible() {
        return OutputBlock._isVisible
    }

    static set isVisible(boolean) {
        if (OutputBlock._isVisible === boolean) return
        OutputBlock._isVisible = boolean
        OutputBlock.instances.forEach( block => block.object.visible = boolean)
        ThreeViewControllerInstance.shouldRender()
    }
}

OutputBlock.instances = new Set()
OutputBlock._isVisible = true