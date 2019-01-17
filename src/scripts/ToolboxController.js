/* global THREE:true, QubitEditorCursor:true */
/* exported ToolboxController */

class ToolboxController {

    static setButton(id, callback) {
        var button = document.getElementById(id)
        button.addEventListener("click", callback)
        return button
    }

    static setCameraButton() {
        const buttonId = "get-camera"
        ToolboxController.cameraButton = this.setButton(buttonId, () => {
            ThreeViewControllerInstance.orbitControls.enabled = true
            QubitEditorCursor.canEdit = false
            console.log("camera mode.")
        })
    }

    static setQubitButton() {
        const buttonId = "place-qubits"
        ToolboxController.qubitButton = this.setButton(buttonId, () => {
            ThreeViewControllerInstance.orbitControls.enabled = false
            QubitEditorCursor.canEdit = true
            console.log("edit mode.")
        })
    }

    static init() {
        ToolboxController.setCameraButton()
        ToolboxController.setQubitButton()
    }
}