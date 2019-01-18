/* 
    global 
    THREE
    Dot
    Electron
    AssetManager
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
        const polarity = this.polarity;
        if (polarity == 1 || polarity == -1) return polarity
        else return NaN
    }
    
    set state(newValue) {
        this.polarity = newValue * 2 - 1
    }

    /**
     * @public @property
     * Getter on polarity computed value
     * @brief represents the qubit state bit value 0, bit value 1 or superposition
     */
    get polarity() {
        if (!this.isDetermined) return 0

        const chargedDots = this.electrons.map( electron => electron.dot )
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
        // if newValue is already set no need do the following expensive steps
        if (newValue == this.polarity) return

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
                break;

            // more of the same
            case -1:
                this.electrons[0].dot = this.dots[1]
                this.electrons[1].dot = this.dots[2]
                this.isDetermined = true
                label = "0"
                break;
            
            case 0:
                // is determined false. The electrons will switch places freneticly
                this.isDetermined = false
                label = "?"

            default: throw console.error("Unexpected polarity value :", newValue)
        }

        // updates the text floating on the box
        this.setLabel(label)
    }


    get charge() {
        return this.electrons.reduce((accumulator, electron) => (accumulator + electron.charge), 0) / this.electrons.length
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
    }

    /**
     * 
     */
    applyPolarityBuffer() {
        this._visited = false
        this.polarity = this._polarityBuffer
    }


    /**
     * 
     * @param {QuantumAutomata} automata 
     */
    processNeighboorsInfluences(automata) {
        if (this._visited) return this._polarityBuffer
        this._visited = true

        const EKIJ = 1 // Kink energy between cells
        const GAMMA = 1 // electron tunneling potential
        var sigmaPj = 0 // Sum of neighbors influences
        
        automata.getQubitNeighborsAround(this.position).forEach(neighbor => {
            const ADJACENT_KINK = 1
            const DIAGONAL_KINK = -0.2

            const neighborPolarity = neighbor.processNeighboorsInfluences(automata)
            const relativePosition = (new THREE.Vector3()).subVectors(this.position, neighbor.position)
            const kink = relativePosition.length() > 1 ? DIAGONAL_KINK : ADJACENT_KINK
            
            sigmaPj +=  neighborPolarity * neighbor.charge * kink

            if (Number.isNaN(sigmaPj)) 
                throw console.error("Compute error.")
        })

        const numerator = sigmaPj * EKIJ / (2 * GAMMA)
        const balance = numerator / Math.hypot(1, numerator)
        if (Number.isNaN(balance)) 
            throw console.error("Compute error.")
        this._polarityBuffer = Math.sign(balance)
        return this._polarityBuffer
    }

    /**
     * @private @method
     * @brief freneticly moves the electron around to represent uncertainty
     * Will find empty dots and move each electron to a randomly chosen one
     */
    _showUndetermination() {
        if (this.isDetermined) return
        this.electrons.forEach( electron => {
            const chargedDots = this.electrons.map(electron => electron.dot)
            const emptyDots = this.dots.filter(dot => !chargedDots.includes(dot))

            // moves electron to a random empty dot
            electron.dot = emptyDots[Math.round(Math.random())]
        })
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
    constructor(position = new THREE.Vector3(), polarity = 0) {
        // Creates the box with a label
        super(position) // haha


        // TODO OUTPUTS EXTENDS QUBIT, QUBIT CAN HIDE ELECTRONS

        // create dots
        var self = this
        this.dots = [
            new Dot(Qubit.DOT_DIST, Qubit.DOT_DIST, self),
            new Dot(-Qubit.DOT_DIST, Qubit.DOT_DIST, self),
            new Dot(Qubit.DOT_DIST, -Qubit.DOT_DIST, self),
            new Dot(-Qubit.DOT_DIST, -Qubit.DOT_DIST, self)
        ]

        // create electrons
        let dots = this.dots
        this.electrons = [
            new Electron(dots[1]),
            new Electron(dots[2])
        ]

        // sets the polarity, makes sure the dots are in the right place
        this.polarity = polarity
        this._polarityBuffer = polarity

        // tells the recursive processor if the polarity was updated
        this._visited = false

        // Adds object to the scene, calling the render on the next frame
        ThreeViewControllerInstance.addObjectToScene(this.object)

        // Saves the instance into the Class static collection
        Qubit.instances.push(this)
    }

    /**
     * @static @method
     * @brief sets the interval loop shaking the superposed Qubit
     * calls _showUndetermination regularly
     */
    static startDeterminationUpdateLoop() {
        setInterval(() => {
            Qubit.instances.forEach(qubit => { 
                qubit._showUndetermination() 
            })
        }, Qubit.UNDETERMINED_REFRESH_RATE)        
    }
}

/** 
 * @static @private @constant 
 * @brief defines superposition electron movmement frequency 
 * */
Qubit.UNDETERMINED_REFRESH_RATE = 200 // seconds

/** 
 * @static @private @constant
 * @brief distance of the electron from the center of qubit 
 * */
Qubit.DOT_DIST = 0.2

/** 
 * @static @private
 * @brief contains all the instances of Qubit
 * */
Qubit.instances = []
