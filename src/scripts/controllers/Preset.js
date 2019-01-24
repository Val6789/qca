/* 
    exported
    Preset
 */

class Preset {
    static exportQuantomAutomata(quantomAutomata) {
        var quantomExport = []
        quantomAutomata._qubitMap.forEach(qubit => {
            let qPosition = qubit.position
            let exportQubit = {
                x: qPosition.x,
                y: qPosition.y,
                z: qPosition.z,
                type: qubit.type,
                fixed: qubit.fixed
            }
            if (qubit.type == "input") {
                exportQubit.type += qubit.polarity
            }
            quantomExport.push(exportQubit)
        })
        this.downloadPreset(JSON.stringify(quantomExport))
    }

    static downloadPreset(content) {
        let a = document.createElement("a")
        a.href = "data:text/plain;charset=utf-8," + content
        a.download = "preset.json"
        a.target = "_blank"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)

    }

    addToAutomata(automata,reset=false) {
        // var notPr = new Preset('not',AssetManager.Get().presets['not']); notPr.addToAutomata(new AppController().automata)
        if(reset) {
            automata.reset()
        }
        else {
            var i = 0
            while (i < this.presetDescription.length) {
                let qubitPosition = new THREE.Vector3(this.presetDescription[i].x, this.presetDescription[i].y, this.presetDescription[i].z)
                if (automata.getQubit(qubitPosition)) {
                    return false
                }
                i++
            }
        }

        var blockPosition
        var newBlock
        for (let block of this.presetDescription) {
            blockPosition = new THREE.Vector3(block.x, block.y, block.z)
            switch (block.type) {
                case "input1":
                    newBlock = automata.addInput(blockPosition, 1)
                    break
                case "input-1":
                    newBlock = automata.addInput(blockPosition, 0)
                    break
                case "qubit":
                    newBlock = automata.addQubit(blockPosition)
                    break
                case "output":
                    newBlock = automata.addOutput(blockPosition)
                    break
            }
            if (block.fixed) {
                block.fixe()
            }
            console.assert(newBlock)
        }
        return true
    }

    constructor(name, presetDescription) {
        this.name = name
        this.presetDescription = presetDescription
    }
}