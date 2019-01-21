/* Preset */

class Preset {
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
        this.downloadPreset(JSON.stringify(quantomExport))
	}

	static downloadPreset(content){
		let a = document.createElement('a')
		a.href = 'data:text/plain;charset=utf-8,'+content
		a.download = "preset.json"
		a.target = "_blank"
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)

	}

	addToAutomata(automata) { // var notPr = new Preset('not',AssetManager.Get().presets['not']); notPr.addToAutomata(new AppController().automata)
        var i = 0;
        while(i < this.presetDescription.length){
            let qubitPosition = new THREE.Vector3(this.presetDescription[i].x,this.presetDescription[i].y,this.presetDescription[i].z)
            if(automata.getQubit(qubitPosition)) {
                throw console.err("Not enough space for this preset")
                return false
            }
            i++
        }

        var  blockPosition
        for(let block of this.presetDescription) {
            blockPosition = new THREE.Vector3(block.x,block.y,block.z)
            switch(block.type) {
                case "input1":
                    automata.addInput(blockPosition, 1)
                    break;
                case "input0":
                    automata.addInput(blockPosition, -1)
                    break;
                case "qubit":
                    automata.addQubit(blockPosition)
                    break;
                case "output":
                    automata.addOutput(blockPosition)
                    break;
            }
        }
        return true
	}

	constructor(name, presetDescription) {
		this.name = name
		this.presetDescription = presetDescription
	}
}