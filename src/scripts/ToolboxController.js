class ToolboxController {

    static setButton(id, callback) {
        var button = document.getElementById(id)
        button.addEventListener("click", callback)
        return button
    }

    static setCameraButton(threeViewController) {
        const buttonId = "get-camera"
        ToolboxController.cameraButton = this.setButton(buttonId, ev => {
            threeViewController.orbitControls.enabled = true
            QubitEditorCursor.canEdit = false
            console.log("camera mode.")
        })
    }

    static setQubitButton(threeViewController) {
        const buttonId = "place-qubits"
        ToolboxController.qubitButton = this.setButton(buttonId, ev => {
            threeViewController.orbitControls.enabled = false
            QubitEditorCursor.canEdit = true
            console.log("edit mode.")
        })
    }

    static init(threeViewController) {
        ToolboxController.setCameraButton(threeViewController)
        ToolboxController.setQubitButton(threeViewController)
    }
}