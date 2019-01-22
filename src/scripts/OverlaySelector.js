class OverlaySelector {
    // Checkboxes //

    _setQubitLayerSelector() {
        const checkbox = document.getElementById(OverlaySelector.QUBIT_SELECTOR_ID)
        function toggleQubits() {
            Qubit.isVisible = checkbox.value
            InputBlock.isVisible = checkbox.value
            OutputBlock.isVisible = checkbox.value
        }
        checkbox.addEventListener("change", toggleQubits)
        toggleQubits()
    }


    _setElectronLayerSelector() {
        const checkbox = document.getElementById(OverlaySelector.ELECTRON_SELECTOR_ID)
        checkbox.addEventListener("change", {

        })
    }


    _setInfluenceLayerSelector() {
        const checkbox = document.getElementById(OverlaySelector.INFLUENCE_SELECTOR_ID)
        checkbox.addEventListener("change", {

        })
    }

    constructor() {

    }
}

OverlaySelector.INFLUENCE_SELECTOR_ID = "show-influence"
OverlaySelector.ELECTRON_SELECTOR_ID = "show-electrons"
OverlaySelector.QUBIT_SELECTOR_ID = "show-qubit"