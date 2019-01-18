class QuantumAutomata {

    /**
     * @public @method
     * @param {THREE.Vector3} position 
     * @returns {Qubit} 
     */
    getQubit(position) {
        return this._qubitMap.get(QuantumAutomata._positionHash(position))
    }

    
    /**
     * @public @method
     * @param {THREE.Vector3} position 
     */
    addQubit(position) {
        this._addBlock(new Qubit(position))
    }

    
    /**
     * @public @method
     * @param {THREE.Vector3} position 
     * @param {Boolean} State
     * @param {Number} State 0 or 1
     */
    addInput(position, value) {
        this._addBlock(new InputBlock(position, value))
    }


    /**
     * @public @method
     * @param {THREE.Vector3} position 
     */
    addOutput(position) {
        const newBlock = new OutputBlock(position)
        if (this._addBlock(newBlock))
            this._outputs.push(newBlock)
    }


    /**
     * @public @method
     * @param {THREE.Vector3} position 
     */
    removeBlock(position) {
        const hash = QuantumAutomata._positionHash(position)
        const block = this._qubitMap[hash]
        if (!block) throw console.info("Cell is empty:", hash)

        // tries to remove from output list
        const outputIndex = this._outputs.indexOf(block)
        if (outputIndex != -1) this._outputs.splice(outputIndex, 1)

        block.remove()
        if (! delete this._qubitMap[hash]) throw console.error("Failed to delete qubit:", hash)
    }

    
    /**
     * @public @method
     * @param {THREE.Vector3} position 
     * @returns {Array<Qubit>} Array of qubits near the position
     */
    getQubitNeighborsAround(position) {
        return QuantumAutomata._NEIGHBOR_MAP.reduce((accumulator, neighborRelativePosition) => {
            const neighborPosition = (new THREE.Vector3()).addVectors(position, neighborRelativePosition)
            const qubit = this.getQubit(neighborPosition)
            return qubit ? accumulator.concat([qubit]) : accumulator
        }, [])
    }

    
    /**
     * @public @method
     */
    process() {
        if (this._outputs.length == 0) return

        for (let output of this._outputs) {
            output.visited = false;
            output.processNeighboorsInfluences(this)
        }

        this._qubitMap.forEach(qubit => {
            if (qubit instanceof Qubit) qubit.applyPolarityBuffer()
        });
    }


    /**
     * @private @method
     * @param {Block} block 
     */
    _addBlock(block) {
        const hash = QuantumAutomata._positionHash(block.position)
        if (this._qubitMap.get(hash)){
            console.warn("Cell is occupied:", hash)
            block.remove()
            return false
        }
        this._qubitMap.set(hash, block)
        return true
    }

    
    /**
     * @constructor QuantumAutomata
     */
    constructor() {
        this._qubitMap = new Map()
        this._outputs =  new Array()
    }

    
    /**
     * @private @static @method
     * @param {THREE.Vector3} position 
     * @returns {String}
     */
    static _positionHash(position) {
        return `${position.x}:${position.y}:${position.z}`
    }
}

// c bo
/**
 * @private @static @constant @member
 */
QuantumAutomata._NEIGHBOR_MAP = [
    new THREE.Vector3( 0, 0, 1),
    new THREE.Vector3( 1, 0, 1),
    new THREE.Vector3( 1, 0, 0),
    new THREE.Vector3( 1, 0,-1),
    new THREE.Vector3( 0, 0,-1),
    new THREE.Vector3(-1, 0,-1),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(-1, 0, 1)
]