/* global THREE:true, QubitEditor:true */
/* exported ToolboxController */

class ToolboxController {

    _setButton(id, callback) {
        var button = document.getElementById(id)
        button.addEventListener("click", event => {
            callback(event)
            event.stopPropagation()
        }, false)
        return button
    }

    
    _setActive(element) {
        let lastActive = document.querySelector("active");
        if(lastActive) lastActive.classList.remove('active')
        element.classList.add('active')
    }


    _setCameraButton() {
        const buttonId = "get-camera"
        this.cameraButton = this._setButton(buttonId, (event) => {
            this._setActive(event.target)
            ThreeViewControllerInstance.orbitControls.enabled = true
            QubitEditorInstance.canEdit = QubitEditor.canEditEnumeration.NOTHING
            console.log("camera mode.")
        })
    }


    _setQubitButton() {
        const buttonId = "place-qubits"
        this.qubitButton = this._setButton(buttonId, (event) => {
            this._setActive(event.target)
            ThreeViewControllerInstance.orbitControls.enabled = false
            QubitEditorInstance.canEdit = QubitEditor.canEditEnumeration.QUBIT
            console.log("add qubit.")
        })
    }


    _setPositiveInputButton() {
        const buttonId = "positive-input"
        this.positiveInputButton = this._setButton(buttonId, (event) => {
            this._setActive(event.target)
            ThreeViewControllerInstance.orbitControls.enabled = false
            QubitEditorInstance.canEdit = QubitEditor.canEditEnumeration.POSITIVE_INPUT
            console.log("add 1 input.")
        })
    }


    _setNegativeInputButton() {
        const buttonId = "negative-input"
        this.negativeInputButton = this._setButton(buttonId, (event) => {
            this._setActive(event.target)
            ThreeViewControllerInstance.orbitControls.enabled = false
            QubitEditorInstance.canEdit = QubitEditor.canEditEnumeration.NEGATIVE_INPUT
            console.log("add 0 input.")
        })
    }


    _setOutputButton() {
        const buttonId = "place-output"
        this.outputButton = this._setButton(buttonId, (event) => {
            this._setActive(event.target)
            ThreeViewControllerInstance.orbitControls.enabled = false
            QubitEditorInstance.canEdit = QubitEditor.canEditEnumeration.OUTPUT
            console.log("add output.")
        })
    }


    _setEraserButton() {
        const buttonId = "eraser"
        this.eraserButton = this._setButton(buttonId, (event) => {
            this._setActive(event.target)
            ThreeViewControllerInstance.orbitControls.enabled = false
            QubitEditorInstance.canEdit = QubitEditor.canEditEnumeration.REMOVE
            console.log("erase mode.")
        })
    }

    
    _setValuesCheckbox() {
		const checkbox = document.getElementById("check-values")
		checkbox.onclick = function() {
			Qubit.instances.forEach(function(e) {
				e.object.getObjectByName("ValueText").material.visible = checkbox.checked
			})			
		}
	}
    

    _setOutlinesCheckbox() {
		const checkbox = document.getElementById("check-outlines")
		checkbox.onclick = function() {
			Qubit.instances.forEach(function(e) {
				e.object.material.visible = checkbox.checked
			})
		}
    }
    
    
    _setFieldsCheckbox() {
		const checkbox = document.getElementById("check-fields")
		checkbox.onclick = function() {
			// TODO
			if(checkbox.checked) {
				//
			}
			else {
				//~ ThreeViewControllerInstance.scene.getObjectByName("Particles").material.visible = false
			}
		}
    }
    

    init() {
        this._setCameraButton()
        this._setQubitButton()
        this._setNegativeInputButton()
        this._setPositiveInputButton()
        this._setOutputButton()
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
