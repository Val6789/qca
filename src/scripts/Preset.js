/* Preset */

class Preset {
	processMap(description) {
		var blockPosition
		for(let block of description)
		{
			blockPosition = new THREE.Vector3(block.x,block.y,block.z)
			switch(block.type) {
				case "input1":
					this._qubitsTab.push(new InputBlock(blockPosition, 1))
					break;
				case "input0":
					this._qubitsTab.push(new InputBlock(blockPosition, -1))
					break;
				case "qubit":
					this._qubitsTab.push(new Qubit(blockPosition))
					break;
				case "ouput":
					this._qubitsTab.push(new OutputBlock(blockPosition))
					break;
			}
		}
	}

	static exportQuantomAutomata(quantomAutomata) {
		var quantomExport = []
        quantomAutomata._qubitMap.forEach(qubit => {
        	let qPosition = qubit.position
        	let exportQubit = {x:qPosition.x,y:qPosition.y,z:qPosition.z,type:qubit.type}
        	if(qubit.type == "input"){
        		exportQubit.type += qubit.polarity
        	}
        	quantomExport.push(exportQubit)
        })
        window.open('data:text/plain;charset=utf-8,'+JSON.stringify(quantomExport))
	}

	constructor(name, jsonPresetDescription) {
		this.name = name
		this._qubitsTab = []
		this.processMap(JSON.parse(jsonPresetDescription))
	}
}