/*
    global
    THREE
    Dot
    Electron
    Block
*/
/*
    exported
    Qubit
*/

/**
 * @class Qubit
 * @brief represents a QCA cell,
 * - Can vary between 0, 1 or NaN state from influence by other Qubits
 * - All instances of Qubit are owned by the static Qubit.instances
 * - Herits from block
 */
class Qubit extends Block {

    // returns the binary state
    get state() {
        const polarity = this.polarity
        if (polarity == 1 || polarity == -1) return polarity
        else return NaN
    }

    set state(newValue) {
        this.polarity = newValue * 2 - 1
    }

    /**
     * @public @property
     * Getter on polarity computed value
     * @brief represents the qubit state bit value 0, bit value 1 or superposition
     */
    get polarity() {
        if (!this.isDetermined) return 0

        const chargedDots = this.electrons.map(electron => electron.dot)
        if (chargedDots.includes(this.dots[0], this.dots[3])) return 1
        if (chargedDots.includes(this.dots[1], this.dots[2])) return -1

        // unexpected case
        throw console.error("Qubit marked as determined without a valid polarisation.")
    }

    /**
     * @public @property
     * Setter on polarity computed value
     * @brief from given polarity value, will place the electron accordingly
     * @param {Number} newValue -1, 0 or 1
     */
    set polarity(newValue) {
        this._setPolarity(newValue)
    }


    get charge() {
        return this.electrons.reduce((accumulator, electron) => (accumulator + electron.charge), 0) / this.electrons.length
    }


    get clockId() {
        return this._clockId
    }

    set clockId(newId) {
        this._clockId = newId
        this._showFamilyColor(Block.areFamilyColorsVisible)
    }

    /**
     * @public @method
     * @brief Removes qubit from the world
     * - Calls the super class remove, destroying the box
     * - Calls the dots remove, erasing their particles
     * - Calls the electron remove, doing the same
     *
     * A render will be called on the following frame
     */
    remove() {
        super.remove()
        const removed = Qubit.instances.splice(Qubit.instances.indexOf(this), 1)[0]
        removed.dots.forEach(dot => dot.remove())
        removed.electrons.forEach(electron => electron.remove())
        return this
    }

    /**
     * @brief updates polarity value after the recursive processing
     */
    applyPolarityBuffer() {
        //if (!this._visited) this.balance = 0
        //this.balance = Math.sign(this.balance)
        this._visited = false
        this.polarity = Math.sign(this.balance)

        // compute border color
        let yellow = 255
        let blue = 255
        if (this.balance > 0) {
            yellow = 64 - Math.round(64 * Math.abs(this.balance))
            blue = Math.round(Math.max(128 + 128 * Math.abs(this.balance), 255))
        } else if (this.balance < 0) {
            blue = 64 - Math.round(64 * Math.abs(this.balance))
            yellow = Math.round(Math.min(128 + 128 * Math.abs(this.balance), 255))
        }
        this.setColor("rgb(" + yellow + "," + yellow + "," + blue + ")")
    }


    /**
     * @brief recursive processing of all neighboring cells influences
     * @param {QuantumAutomata} automata
     */
    processNeighboorsInfluences(automata) {
        // recursive end conditions
        if (this._visited) return this.balance

        // if the block wasn't visited, and it's not its turn, then add it to pending list
        if (automata.atLeastOneUseClock && automata.clockTime != this.clockId) {
            automata.pendingProcesses.add(this)
            return this.balance
        }

        // Get this block and all its entangled counterparts in an array
        const entangled = [this].concat(automata.getEntangledBlocks(this))
        entangled.forEach(block => block._visited = true)

        // Equation constants
        const IJ_KINK_ENERGY = 1 // Kink energy between cells
        const GAMMA = 1 // electron tunneling potential
        const ADJACENT_KINK = 1
        const DIAGONAL_KINK = -0.2


        // Equation variable
        var neighborPolaritySum = 0 // Sum of neighbors influences

        for (const currentBlock of entangled) {
            // fetch neighbors around each block
            const neighbors = automata.getQubitNeighborsAround(currentBlock.position)

            for (const neighbor of neighbors) {
                // get the position vector of the neighbor relative to the current block
                const relativePosition = (new THREE.Vector3()).subVectors(currentBlock.position, neighbor.position)

                // Compute the qubit equation
                let kink = relativePosition.length() > 1 ? DIAGONAL_KINK : ADJACENT_KINK
                kink *= relativePosition.y != 0 ? -1 : 1

                // recursive call
                neighbor.processNeighboorsInfluences(automata)
                const neighborPolarity = neighbor.balance * neighbor.charge * kink 
                neighborPolaritySum += Qubit._applyNeighbborPolarityResponseFunction(neighborPolarity)
            }
        }

        // final equation
        const numerator = neighborPolaritySum * IJ_KINK_ENERGY / (2 * GAMMA)
        const balance = numerator / Math.hypot(numerator, 1)

        // Apply results to all entangled blocks
        entangled.forEach(block => block.balance = balance)

        //this.balance = Math.sign(this.balance)
        // return result
        return this.balance
    }


    static _applyNeighbborPolarityResponseFunction(neighborPolarity) {
        // defines the responsivity
        const sigmoidSlopeStrength = 6.5
        return 1 / (Math.exp(-sigmoidSlopeStrength * neighborPolarity) + 1) * 2 - 1
    }


    /**
     * @private @method
     * @brief freneticly moves the electron around to represent uncertainty
     * Will find empty dots and move each electron to a randomly chosen one
     */
    _showUndetermination() {
        if (this.isDetermined) return
        this.electrons.forEach(electron => {
            const chargedDots = this.electrons.map(electron => electron.dot)
            const emptyDots = this.dots.filter(dot => !chargedDots.includes(dot))

            // moves electron to a random empty dot
            electron.dot = emptyDots[Math.round(Math.random())]
        })
    }


    _setPolarity(newValue) {
        // if newValue is already set no need do the following expensive steps
        if (newValue === this.polarity) return false

        var label // will save the text displayed on the qubit

        switch (newValue) {
            case 1:
                // move electrons to the right dots
                this.electrons[0].dot = this.dots[0]
                this.electrons[1].dot = this.dots[3]

                // is not in superposition
                this.isDetermined = true

                // define text label
                label = "1"
                break

                // more of the same
            case -1:
                this.electrons[0].dot = this.dots[1]
                this.electrons[1].dot = this.dots[2]
                this.isDetermined = true
                label = "0"
                break

            case 0:
                // is determined false. The electrons will switch places freneticly
                this.isDetermined = false
                label = "?"
                break

            default:
                throw console.error("Unexpected polarity value :", newValue)
        }

        if (newValue != this.polarity)
            console.error("Failed to set the polarity")

        // updates the text floating on the box
        this.setLabel(label)

        return true
    }

    resetPolarity() {
        this.balance = 0
        this.polarity = 0
        return true
    }

    /**
     * @constructor of Qubit
     * @warning Places the object in the scene, no need to do it again.
     *
     * @param {THREE.Vertex3} position in 3D space
     * @param {Any} polarity, expects 0, 1, true, false or NaN (see get polarity())
     *
     * Creates 4 dots, and 2 electrons
     * The instance is owned by the class inside Qubit.instances
     * A render will be called on the next frame
     */
    constructor(position = new THREE.Vector3(0, 0, 0), polarity = 0, enableParticles = true) {
        // Creates the box with a label
        super(position) // haha

        // create dots
        var self = this

        this.dots = Qubit.DOT_PLACEMENTS.map(position => new Dot(position, self, enableParticles))

        this.type = "qubit"

        // create electrons
        let dots = this.dots
        this.electrons = [
            new Electron(dots[1], enableParticles),
            new Electron(dots[2], enableParticles)
        ]

        // sets the polarity, makes sure the dots are in the right place
        this.polarity = polarity
        this.balance = 0

        this.clockId = Qubit.selectedClockId
        this._showFamilyColor(Qubit._areFamilyColorsVisible)

        // tells the recursive processor if the polarity was updated
        this._visited = false

        this.setLabel("?")

        // Adds object to the scene, calling the render on the next frame
        AppControllerInstance.view.addObjectToScene(this.object)

        // Saves the instance into the Class static collection
        Qubit.instances.push(this)
    }

    /**
     * @static @method
     * @brief sets the interval loop shaking the superposed Qubit
     * calls _showUndetermination regularly
     */
    static updateAllQubitDetermination() {
        Qubit.instances.forEach(qubit => {
            qubit._showUndetermination()
        })
    }


    static get areFamilyColorsVisible() {
        return Qubit._areFamilyColorsVisible
    }

    static set areFamilyColorsVisible(boolean) {
        Qubit._areFamilyColorsVisible = boolean
        if (Qubit.instances) Qubit.instances.forEach(qubit => {
            qubit._showFamilyColor(boolean)
        })
    }
}

/**
 * @static @private @constant
 * @brief defines superposition electron movmement frequency
 * */
Qubit.UNDETERMINED_REFRESH_RATE = 100 // seconds
/**
 * @static @private @constant
 * @brief distance of the electron from the center of qubit
 * */
Qubit.DOT_PLACEMENTS = [
    new THREE.Vector3(0.2, 0, 0.2),
    new THREE.Vector3(0.2, 0, -0.2),
    new THREE.Vector3(-0.2, 0, 0.2),
    new THREE.Vector3(-0.2, 0, -0.2)
]

Qubit.FAMILY_COLORS = [
    "#0C0",
    "#C0D",
    "#0AA",
    "#F40"
]

Qubit.selectedClockId = 0
Qubit._areFamilyColorsVisible = false

/**
 * @static @private
 * @brief contains all the instances of Qubit
 * */
Qubit.instances = []
