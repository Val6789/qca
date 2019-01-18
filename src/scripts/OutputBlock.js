class OutputBlock extends Qubit {

    set polarity(value) {
        var label
        switch (value) {
            case 1: case true:
                label = "1"
                break;

            case 0: case false:
                label = "0"
        
            default:
                label = "?"
                break;
        }
        this.setLabel(label)
    }

    constructor(position) {
        super(position)
        this.polarity = NaN
    }

}