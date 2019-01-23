class OverlaySelector {
    // Checkboxes //

    _setQubitLayerSelector()  {
        var checkbox = document.getElementById(OverlaySelector.QUBIT_SELECTOR_ID)
        function toggleQubits() {
            Qubit.isVisible = checkbox.checked
            InputBlock.isVisible = checkbox.checked
            OutputBlock.isVisible = checkbox.checked

            // forces active css 
            checkbox.parentElement.classList.toggle("active",checkbox.checked)
        }
        checkbox.addEventListener("change", toggleQubits)
        toggleQubits()
    }


    _setInfluenceLayerSelector() {
        var checkbox = document.getElementById(OverlaySelector.ELECTRON_SELECTOR_ID)
        function toggleElectrons() {
            Electron.particles.layers[Electron.TEXTURE_LAYER].visible = checkbox.checked
            Dot.particles.layers[0].visible = checkbox.checked

            // forces active css 
            checkbox.parentElement.classList.toggle("active",checkbox.checked)
            ThreeViewControllerInstance.shouldRender()
        }
        checkbox.addEventListener("change", toggleElectrons)
        toggleElectrons()
    }


    _setElectronLayerSelector() {
        var checkbox = document.getElementById(OverlaySelector.INFLUENCE_SELECTOR_ID)
        function toggleInfluences() {
            Electron.particles.layers[Electron.INFLUENCE_LAYER].visible = checkbox.checked

            // forces active css 
            checkbox.parentElement.classList.toggle("active",checkbox.checked)
            ThreeViewControllerInstance.shouldRender()
        }
        checkbox.addEventListener("change", toggleInfluences)
        toggleInfluences()
    }

    constructor() {
        this._setQubitLayerSelector()
        this._setInfluenceLayerSelector()
        this._setElectronLayerSelector()
    }
}

OverlaySelector.INFLUENCE_SELECTOR_ID = "show-influence"
OverlaySelector.ELECTRON_SELECTOR_ID = "show-electrons"
OverlaySelector.QUBIT_SELECTOR_ID = "show-qubit"