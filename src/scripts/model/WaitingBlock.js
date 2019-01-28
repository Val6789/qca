/*
    global OutputBlock
*/
/*
    exported WaitingBlock
*/

class WaitingBlock extends OutputBlock {

    static checkCompletion() {
        if (WaitingBlock.instances.length == 0) return
        let arr = [...(WaitingBlock.instances)]
        let completed = !arr.some(block => !block.complete)
        MissionManager.Get().obtained()
        AppControllerInstance.setPause()
        setTimeout(() => {
            AppControllerInstance.automata.reset()
        }, 1000)
    }

    get complete() {
        return this.polarity == this.value
    }

    applyPolarityBuffer() {
        super.applyPolarityBuffer()

        if (this.complete) {
            WaitingBlock.checkCompletion()
            this.setColor("rgb(" + 0 + "," + 255 + "," + 0 + ")")
        } else {
            this.setColor("rgb(" + 255 + "," + 0 + "," + 0 + ")")
        }
        return
    }

    remove() {
        WaitingBlock.instances.delete(this)
        super.remove()
    }

    constructor(position, value) {
        super(position, 0, false)
        this.type = "waiting"
        this.setLabel("w" + value)
        this.value = value

        WaitingBlock.instances.add(this)
    }
}

WaitingBlock.instances = new Set()
