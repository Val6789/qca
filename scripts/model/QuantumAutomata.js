/*
    global
    Qubit
    InputBlock
    OutputBlock

*/


class QuantumAutomata {

    getOccupiedPositions() {
        var values = new Array()
        this._qubitMap.forEach(value => values.push(value))
        return values.map(block => block.position)
    }

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
        this.shouldResetPolarity()
        let block = new Qubit(position)
        if(Qubit.selectedClockId != 0) this.qcaUseClock()
        if (this._addBlock(block)) return block
        return false
    }

    qcaUseClock() {
        if (!this.atLeastOneUseClock) {
            this.atLeastOneUseClock = true
            UIControllerInstance.overlaySelector.toggleFamilyLayer(true)
        }
    }


    /**
     * @public @method
     * @param {THREE.Vector3} position
     * @param {Boolean} State
     * @param {Number} State 0 or 1
     */
    addInput(position, value) {
        this.shouldResetPolarity()
        let block = new InputBlock(position, value ? 1 : -1)
        if (this._addBlock(block)) return block
        return false
    }


    /**
     * @public @method
     * @param {THREE.Vector3} position 
     */
    addOutput(position) {
        const newBlock = new OutputBlock(position)
        if (this._addBlock(newBlock)) {
            this._outputs.add(newBlock)
            this.shouldResetPolarity()
            return newBlock
        }
        return false
    }


    addWaiting(position, value = undefined) {
        const hash = QuantumAutomata._positionHash(position)

        if (this._qubitMap.has(hash)) {
            const block = this._qubitMap.get(hash)
            if (!(block instanceof OutputBlock))
                return
            else
                this.removeBlock(position)
        }

        if (!value)
            value = Number(prompt("Value of the waiting block ?", 0))
        const newBlock = new WaitingBlock(position, value)
        if (this._addBlock(newBlock)) {
            this._outputs.add(newBlock)
            return newBlock
        }
        return false
    }

    /**
     * @public @method
     * @param {THREE.Vector3} position
     */
    makeBridge(position) {
        // check if cell is set
        const hash = QuantumAutomata._positionHash(position)
        if (!this._qubitMap.has(hash)) return
        const block = this._qubitMap.get(hash)

        if (block instanceof InputBlock) return
        if (block instanceof OutputBlock) return

        // check for pending bridge
        if (Bridge.pending) {
            History.add("bridge", "", block.position, Bridge.pending.start.position);
            Bridge.pending.setDestination(block)
            this.shouldResetPolarity()
        } else { // initiate bridge
            this._bridges.add(new Bridge(block))
        }
        this._updateInfos()
    }


    /**
     * @brief deletes a bridge matching the start/end position
     * @param {THREE.Vector3} end
     * @param {THREE.Vector3} start
     */
    removeBridgeWithPosition(start, end) {
        this.shouldResetPolarity()
        var bridgeToRemove = false
        this._bridges.forEach(bridge => {
            if ((bridge.start.position.equals(start) && bridge.end.position.equals(end)) || (bridge.start.position.equals(end) && bridge.end.position.equals(start)))
                bridgeToRemove = bridge
        })
        if (bridgeToRemove) this._bridges.delete(bridgeToRemove.remove())
    }


    /**
     * @brief Cancels bridge construction and destroys the pending bridge
     */
    abortBridge() {
        this._bridges.delete(Bridge.pending.remove())
        this._updateInfos()
    }


    /**
     * @brief clears the qubit map
     */
    reset() {
        this._qubitMap.forEach(qubit => {
            this.removeBlock(qubit.position, true)
        })
    }

    /**
     * @brief disallows editing of a block
     * @param {THREE.Vector3} position of the target block
     */
    lockBlock(position) {
        const hash = QuantumAutomata._positionHash(position)
        if (!this._qubitMap.has(hash)) return
        const block = this._qubitMap.get(hash)
        block.toogleFixe()
    }

    /**
     * throws in console the target block
     * @param {THREE.Vector3} position of the target block
     */
    logBlock(position) {
        const hash = QuantumAutomata._positionHash(position)
        console.info(this._qubitMap.get(hash))
    }

    /**
     * @public @method
     * @param {THREE.Vector3} position 
     * @param {bool} adminRemove To remove fixed blocks (fixed blocks are ones wich can't be modified in missions) 
     */
    removeBlock(position, adminRemove = false) {
        const hash = QuantumAutomata._positionHash(position)
        if (!this._qubitMap.has(hash)) return

        const block = this._qubitMap.get(hash)
        if (block.fixed && !adminRemove) return
        this.shouldResetPolarity()

        History.add('remove', block.type, position, block.polarity);

        this._bridges.forEach(bridge => {
            const bridgedBlock = bridge.traverseIfIsAnEnterPoint(block)
            if (bridgedBlock) this._bridges.delete(bridge.remove())
        })

        block.remove()
        this._outputs.delete(block)
        this._qubitMap.delete(hash)

        // this._startProcessFrom(block)
        // this._applyProcessing()
        this._updateInfos()
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
     * @param {Qubit}
     * @returns {Array<Qubit>} entangled qubits
     */
    getEntangledBlocks(sourceBlock) {
        var entangledBlocks = new Array()
        sourceBlock._checkedForEntenglement = true
        this._bridges.forEach(bridge => {
            const end = bridge.traverseIfIsAnEnterPoint(sourceBlock)
            if (end && !end._checkedForEntenglement) {
                entangledBlocks.push(end)
                entangledBlocks = entangledBlocks.concat(this.getEntangledBlocks(end))
            }
        })
        return entangledBlocks
    }

    /**
     * @public @method
     */
    process() {
        this._resetAllBlocksPolarity()
        this.clockTime = (this.clockTime + 1) % Qubit.FAMILY_COLORS.length
        if (this._outputs.size === 0) return
        this._outputs.forEach(output => this._startProcessFrom(output))
        this._applyProcessing()
    }

    _resetAllBlocksPolarity() {
        if(this.shouldResetTrigger) {
            this.clockTime = 0
            this.shouldResetTrigger = false
            this._qubitMap.forEach(qubit => {
                qubit.resetPolarity()
            })
        }
    }

    _startProcessFrom(qubit) {
        //qubit._visited = false
        qubit.processNeighboorsInfluences(this)

        // when the process array is empty the recursion will end
        this.pendingProcesses.forEach((pendingQubitProcessing) => {
            if (pendingQubitProcessing.clockId === this.clockTime) {
                this.pendingProcesses.delete(pendingQubitProcessing)
                this._startProcessFrom(pendingQubitProcessing)
            }
        })
    }


    _applyProcessing() {
        this._qubitMap.forEach(qubit => {
            if (qubit instanceof Qubit) qubit.applyPolarityBuffer()
            qubit._checkedForEntenglement = false
        })
    }


    /**
     * @private @method
     * @param {Block} block
     */
    _addBlock(block) {
        const hash = QuantumAutomata._positionHash(block.position)
        if (this._qubitMap.has(hash)) {
            let exist = this.getQubit(block.position)
            if (!exist.fixed && exist.type == "input" && (block.type == "input" || block.type == "output")) {
                // History.add("change", block.type, block.position, block.polarity)
                let value = exist.polarity
                let position = exist.position
                this.removeBlock(exist.position)
                this.addInput(position, (value < 0))
            }
            block.remove()
            this._updateInfos()
            return false
        } else {
            History.add("add", block.type, block.position, block.polarity)
            this._qubitMap.set(hash, block)
            this._updateInfos()
            return true
        }
    }


    _updateInfos() {
        const element = document.getElementById("automata-info")
        element.innerHTML = `qubits: ${this._qubitMap.size}<br>outputs: ${this._outputs.size}<br>bridges: ${this._bridges.size}`
    }

    shouldResetPolarity() {
        this.shouldResetTrigger = true
    }

    /**
     * @constructor QuantumAutomata
     */
    constructor() {
        this._qubitMap = new Map()
        this._outputs = new Set()
        this._bridges = new Set()
        this.pendingProcesses = new Set() // contains the list of not-visited blocks waiting for their clock

        this.clockTime = 0
        this.atLeastOneUseClock = false

        this.shouldResetTrigger = false
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
    new THREE.Vector3(0, 0, 1), // up
    new THREE.Vector3(1, 0, 0), // right
    new THREE.Vector3(0, 0, -1), // down
    new THREE.Vector3(-1, 0, 0), // left
    new THREE.Vector3(-1, 0, -1), // down left
    new THREE.Vector3(-1, 0, 1), // up left
    new THREE.Vector3(1, 0, 1), // up right
    new THREE.Vector3(1, 0, -1), // down right
    new THREE.Vector3(0, 1, 0), // top
    new THREE.Vector3(0, -1, 0) // left
]
