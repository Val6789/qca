class OverlaySelector {
    // Checkboxes //

    toggleFamilyLayer(boolean) {
        console.log(boolean)
        this.familiesCheckbox.checked = boolean
        this.familiesCheckbox.parentElement.classList.toggle("active", boolean)
        Qubit.areFamilyColorsVisible = boolean
    }

    _setFamilyLayerSelector() {
        this.familiesCheckbox = document.getElementById(OverlaySelector.FAMILIES_SELECTOR_ID)
        this.familiesCheckbox.addEventListener("change", () => this.toggleFamilyLayer(this.familiesCheckbox.checked))
        this.toggleFamilyLayer(this.familiesCheckbox.checked)
    }

    _setQubitLayerSelector() {
        this._setFamilyLayerSelector()
        this.qubitLayerCheckbox = document.getElementById(OverlaySelector.QUBIT_SELECTOR_ID)
        var toggleQubits = () => {
            Block.areVisible = this.qubitLayerCheckbox.checked
            Bridge.areVisible = this.qubitLayerCheckbox.checked
            if (this.qubitLayerCheckbox.checked == false)
                this.toggleFamilyLayer(false)

            // forces active css
            this.qubitLayerCheckbox.parentElement.classList.toggle("active", this.qubitLayerCheckbox.checked)
        }
        this.qubitLayerCheckbox.addEventListener("change", toggleQubits)
        toggleQubits()
    }


    _setInfluenceLayerSelector() {
        var checkbox = document.getElementById(OverlaySelector.ELECTRON_SELECTOR_ID)

        function toggleElectrons() {
            Electron.particles.layers[Electron.TEXTURE_LAYER].visible = checkbox.checked
            Dot.particles.layers[0].visible = checkbox.checked
            // forces active css
            checkbox.parentElement.classList.toggle("active", checkbox.checked)
            AppControllerInstance.view.shouldRender()
        }
        checkbox.addEventListener("change", toggleElectrons)
        toggleElectrons()
    }


    _setElectronLayerSelector() {
        var checkbox = document.getElementById(OverlaySelector.INFLUENCE_SELECTOR_ID)

        function toggleInfluences() {
            Electron.particles.layers[Electron.INFLUENCE_LAYER].visible = checkbox.checked

            // forces active css
            checkbox.parentElement.classList.toggle("active", checkbox.checked)
            AppControllerInstance.view.shouldRender()
        }
        checkbox.addEventListener("change", toggleInfluences)
        toggleInfluences()
    }


    _setKittenLayerSelector() {
        var checkbox = document.getElementById(OverlaySelector.KITTEN_SELECTOR_ID)

        function toggleLKittens() {
            OutputBlock.areKittensVisible = checkbox.checked

            // forces active css
            checkbox.parentElement.classList.toggle("active", checkbox.checked)
            AppControllerInstance.view.shouldRender()
        }
        checkbox.addEventListener("change", toggleLKittens)
        toggleLKittens()
    }

    constructor() {
        this._setQubitLayerSelector()
        this._setInfluenceLayerSelector()
        this._setElectronLayerSelector()
        this._setKittenLayerSelector()
    }
}

OverlaySelector.FAMILIES_SELECTOR_ID = "show-families"
OverlaySelector.INFLUENCE_SELECTOR_ID = "show-influence"
OverlaySelector.ELECTRON_SELECTOR_ID = "show-electrons"
OverlaySelector.QUBIT_SELECTOR_ID = "show-qubit"
OverlaySelector.KITTEN_SELECTOR_ID = "show-kittens"
