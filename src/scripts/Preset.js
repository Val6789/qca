/* Preset */

class Preset {
	processMap(description) {
		var blockPosition
		for(let block of description)
		{
			blockPosition = new THREE.Vector3(block.x,block.y,block.z)
			switch(block.type) {
				case "one":
					this.QubitsTab.push(new InputBlock(blockPosition, 1))
					break;
				case "zero":
					this.QubitsTab.push(new InputBlock(blockPosition, -1))
					break;
				case "variable":
					this.QubitsTab.push(new Qubit(blockPosition))
					break;
				case "out":
					this.QubitsTab.push(new OutputBlock(blockPosition))
					break;
			}
		}
	}

	static exportQuantumAutomata(quantomAutomata) {
		var quantomExport = []
        quantomAutomata._qubitMap.forEach(qubit => {
        	// TO DO when the editor work again
        })
	}

	constructor(name, jsonPresetDescription) {
		this.name = name
		this.QubitsTab = []
		this.processMap(JSON.parse(jsonPresetDescription))
	}
}