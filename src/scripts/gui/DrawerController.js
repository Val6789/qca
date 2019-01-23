class DrawerController {

	_initPresetLoading() {
		var container = document.getElementById('drawer-demos').getElementsByClassName('drawer-main')[0];
		for(let presetId in AssetManager.Get().presets) {
			let htmlPresetElem = document.createElement('button')
			htmlPresetElem.classList.add('btn')
			htmlPresetElem.setAttribute('data-preset',presetId)
			htmlPresetElem.innerHTML = presetId
			htmlPresetElem.onclick = function(){
				let presetName = this.getAttribute('data-preset')
				let constructedPreset = new Preset(presetName,AssetManager.Get().presets[presetName])
				constructedPreset.addToAutomata(new AppController().automata)
				document.getElementById('no-drawer-check').checked = true
			}
			container.appendChild(htmlPresetElem)
		}
	}

    init() {
    	this._initPresetLoading()
    }

    constructor() {
        if (!DrawerController.instance) {
            DrawerController.instance = this
        }

        return DrawerController.instance
    }
}

const DrawerControllerInstance = new DrawerController()