/*
    global
    Preset
*/


/* eslint-disable no-useless-escape */
class DrawerController {

    _initPresetLoading() {
        var container = document.getElementById("drawer-demos")
            .getElementsByClassName("drawer-main")[0]
        for (let presetId in AssetManager.Get().presets) {
            if (!presetId.match(/Mission/ig)) {
                let htmlPresetElem = document.createElement("button")
                htmlPresetElem.classList.add("inlinebtn")
                htmlPresetElem.classList.add("btn")
                htmlPresetElem.setAttribute("data-preset", presetId)
                htmlPresetElem.innerHTML = presetId.replace(/\_/gi, " ")
                htmlPresetElem.onclick = function () {
                    let presetName = this.getAttribute("data-preset")
                    UxSaverInstance.add("loadPreset", presetName)
                    let constructedPreset = new Preset(presetName, AssetManager.Get().presets[presetName])
                    constructedPreset.addToAutomata(new AppController().automata, true)
                    document.getElementById("no-drawer-check").checked = true
                }
                container.appendChild(htmlPresetElem)
            }
        }
    }

    _initDrawerEvents() {
        var drawers = document.getElementsByClassName("drawer")
        for (let d of drawers) {
            d.addEventListener("click", function (event) {
                event.stopPropagation()
            })
            d.addEventListener("mousemove", function (event) {
                event.stopPropagation()
            })
            d.addEventListener("wheel", function (event) {
                event.stopPropagation()
            })
        }
    }
    _initLoadDemoFromFile() {
        var file = document.getElementById('file_demo')
        file.onchange = function() {
            var reader = new FileReader()
            reader.readAsText(file.files[0],"utf-8")
            reader.onload = function(e) {
                UxSaverInstance.add("loadOutPreset", "")
                let constructedPreset = new Preset("out", JSON.parse(e.target.result))
                constructedPreset.addToAutomata(new AppController().automata, true)
                document.getElementById("no-drawer-check").checked = true
            }
        }
    }

    init() {
        this._initPresetLoading()
        this._initDrawerEvents()
        this._initLoadDemoFromFile()
    }

    constructor() {
        if (!DrawerController.instance) {
            DrawerController.instance = this
        }

        return DrawerController.instance
    }
}

// eslint-disable-next-line no-unused-vars
const DrawerControllerInstance = new DrawerController()