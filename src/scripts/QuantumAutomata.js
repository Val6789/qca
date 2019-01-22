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
        return this._addBlock(new Qubit(position))
    }

    
    /**
     * @public @method
     * @param {THREE.Vector3} position 
     * @param {Boolean} State
     * @param {Number} State 0 or 1
     */
    addInput(position, value) {
        return this._addBlock(new InputBlock(position, value ? 1 : -1 ))
    }


    /**
     * @public @method
     * @param {THREE.Vector3} position 
     */
    addOutput(position) {
        const newBlock = new OutputBlock(position)
        if (this._addBlock(newBlock)) {
            this._outputs.add(newBlock)
            return true
        }
        return false
    }

    /**
     * @public @method
     * @param {THREE.Vector3} position 
     */
    removeBlock(position) {
        const hash = QuantumAutomata._positionHash(position)
        if (!this._qubitMap.has(hash)) return

        const block = this._qubitMap.get(hash)
        History.add('remove',block.type,position,block.type,block.polarity);
        block.remove()
        this._outputs.delete(block)
        this._qubitMap.delete(hash)

        this._startProcessFrom(block)
        this._applyProcessing()
    }

    
    /**
     * @public @method
     * @param {THREE.Vector3} position 
     * @returns {Array<Qubit>} Array of qubits near the position
     */
    getQubitNeighborsAround(position) {
        return QuantumAutomata._NEIGHBOR_MAP.reduce((accumulator, neighborRelativePosition) => {
            const neighborPosition = (new THREE.Vector3()).addVectors(position, neighborRelativePosition)
            const hash = QuantumAutomata._positionHash(neighborPosition)
            if (this._qubitMap.has(hash))
                accumulator.push(this._qubitMap.get(hash))
            return accumulator
        }, [])
    }

    
    /**
     * @public @method
     */
    process() {
        if (this._outputs.size === 0) return
        this._outputs.forEach( output => this._startProcessFrom(output))
        this._applyProcessing()
    }


    _startProcessFrom(qubit) {
        qubit._visited = false;
        qubit.processNeighboorsInfluences(this)
    }


    _applyProcessing() {
        this._qubitMap.forEach(qubit => {
            if (qubit instanceof Qubit) qubit.applyPolarityBuffer()
        })
    }
    

    /**
     * @private @method
     * @param {Block} block 
     */
    _addBlock(block) {
        const hash = QuantumAutomata._positionHash(block.position)
        if (this._qubitMap.has(hash)){
            let exist = this.getQubit(block.position)
            if(exist.type == 'input' && block.type == 'input')
            {
                History.add('change',block.type,block.position,block.polarity);
                let value = exist.polarity
                let position = exist.position
                this.removeBlock(exist.position)
                this.addInput(position,(value<0))
            }
            block.remove()
            return false
        } else {
            History.add('add',block.type,block.position,block.polarity);
            this._qubitMap.set(hash, block)
            return true
        }
    }

    
    /**
     * @constructor QuantumAutomata
     */
    constructor() {
        this._qubitMap = new Map()
        this._outputs =  new Set()
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


/**
 * @private @static @constant @member
 */
QuantumAutomata._NEIGHBOR_MAP = [
    new THREE.Vector3( 0, 0, 1), // up
    new THREE.Vector3( 1, 0, 1), // up right
    new THREE.Vector3( 1, 0, 0), // right
    new THREE.Vector3( 1, 0,-1), // right down
    new THREE.Vector3( 0, 0,-1), // down
    new THREE.Vector3(-1, 0,-1), // down left
    new THREE.Vector3(-1, 0, 0), // left
    new THREE.Vector3(-1, 0, 1)  // up left
]