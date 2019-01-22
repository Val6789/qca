/*
    global Qubit
*/
/*
    exported OutputBlock
*/

class OutputBlock extends Qubit {
    constructor(position) {
        super(position, 0, false)
        this.type = "output"
    }
}