/* global THREE:true, QubitEditorCursor:true */
/* exported ToolboxController */

class ToolboxController {

    _setButton(id, callback) {
        var button = document.getElementById(id)
        button.addEventListener("click", callback)
        return button
    }

    _setCameraButton() {
        const buttonId = "get-camera"
        ToolboxController.cameraButton = this._setButton(buttonId, () => {
            ThreeViewControllerInstance.orbitControls.enabled = true
            QubitEditorCursor.canEdit = QubitEditorCursor.canEditEnumeration.NOTHING
            console.log("camera mode.")
        })
    }

    _setQubitButton() {
        const buttonId = "place-qubits"
        ToolboxController.qubitButton = this._setButton(buttonId, () => {
            ThreeViewControllerInstance.orbitControls.enabled = false
            QubitEditorCursor.canEdit = QubitEditorCursor.canEditEnumeration.QUBIT
            console.log("add qubit.")
        })
    }

    _setPositiveInputButton() {
        const buttonId = "place-positive-input"
        ToolboxController.qubitButton = this._setButton(buttonId, () => {
            ThreeViewControllerInstance.orbitControls.enabled = false
            QubitEditorCursor.canEdit = QubitEditorCursor.canEditEnumeration.POSITIVE_INPUT
            console.log("add 1 input.")
        })
    }

    _setNegativeInputButton() {
        const buttonId = "place-negative-input"
        ToolboxController.qubitButton = this._setButton(buttonId, () => {
            ThreeViewControllerInstance.orbitControls.enabled = false
            QubitEditorCursor.canEdit = QubitEditorCursor.canEditEnumeration.NEGATIVE_INPUT
            console.log("add 0 input.")
        })
    }

    _setOutputButton() {
        const buttonId = "place-output"
        ToolboxController.qubitButton = this._setButton(buttonId, () => {
            ThreeViewControllerInstance.orbitControls.enabled = false
            QubitEditorCursor.canEdit = QubitEditorCursor.canEditEnumeration.OUTPUT
            console.log("add output.")
        })
    }

    _setEraserButton() {
        const buttonId = "eraser"
        ToolboxController.qubitButton = this._setButton(buttonId, () => {
            ThreeViewControllerInstance.orbitControls.enabled = false
            QubitEditorCursor.canEdit = QubitEditorCursor.canEditEnumeration.REMOVE
            console.log("erase mode.")
        })
    }

    init() {
        this._setCameraButton()
        this._setQubitButton()
        this._setNegativeInputButton()
        this._setPositiveInputButton()
        this._setEraserButton()
    }

    constructor() {
        if (!ToolboxController.instance) {
            ToolboxController.instance = this
        } 

        return ToolboxController.instance
    }
}

const ToolboxControllerInstance = new ToolboxController()