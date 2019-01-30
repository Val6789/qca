class DrawerController {

    _initPresetLoading() {
        var container = document.getElementById('drawer-demos')
            .getElementsByClassName('drawer-main')[0]
        for (let presetId in AssetManager.Get().presets) {
            if(!presetId.match(/Mission/ig)) {
                let htmlPresetElem = document.createElement('button')
                htmlPresetElem.classList.add('inlinebtn')
                htmlPresetElem.classList.add('btn')
                htmlPresetElem.setAttribute('data-preset', presetId)
                htmlPresetElem.innerHTML = presetId.replace(/\_/gi, ' ')
                htmlPresetElem.onclick = function () {
                    let presetName = this.getAttribute('data-preset')
                    UxSaverInstance.add('loadPreset', presetName)
                    let constructedPreset = new Preset(presetName, AssetManager.Get().presets[presetName])
                    constructedPreset.addToAutomata(new AppController().automata, true)
                    document.getElementById('no-drawer-check').checked = true
                }
                container.appendChild(htmlPresetElem)
            }
        }
    }

    _initDrawerEvents() {
        var drawers = document.getElementsByClassName('drawer')
        for (let d of drawers) {
            d.addEventListener('click', function (event) {
                event.stopPropagation()
            })
            d.addEventListener('mousemove', function (event) {
                event.stopPropagation()
            })
            d.addEventListener('wheel', function (event) {
                event.stopPropagation()
            })
        }
    }

    init() {
        this._initPresetLoading()
        this._initDrawerEvents()
    }

    constructor() {
        if (!DrawerController.instance) {
            DrawerController.instance = this
        }

        return DrawerController.instance
    }
}

const DrawerControllerInstance = new DrawerController()
