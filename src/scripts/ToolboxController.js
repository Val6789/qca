/* global THREE:true, QubitEditor:true */
/* exported ToolboxController */

class ToolboxController {
	// Tool buttons //
	
    _setButton(id, callback) {
        var button = document.getElementById(id)
        button.addEventListener("mouseup", event => {
            callback(event)
            event.stopPropagation()
        }, false)
        return button
    }

    
    _setActive(element) {
        let lastActive = element.parentNode.getElementsByClassName('active')
        if(lastActive.length > 0) lastActive[0].classList.remove('active')
        element.classList.add('active')
    }


    _setCameraButton() {
        const buttonId = "get-camera"
        var self = this
        this.cameraButton = this._setButton(buttonId, event=>{self._setCameraButtonClick(event.target)})
    }
    _setCameraButtonClick(target){
        this._setActive(target)
        ThreeViewControllerInstance.orbitControls.enableRotate = true
        ThreeViewControllerInstance.orbitControls.enablePan = true
        QubitEditorInstance.canEdit = QubitEditor.canEditEnumeration.NOTHING
    }


    _setQubitButton() {
        const buttonId = "place-qubits"
        var self = this
        this.qubitButton = this._setButton(buttonId, (event) => {self._setQubitButtonClick(event.target)})
    }
    _setQubitButtonClick(target) {
        this._setActive(target)
        ThreeViewControllerInstance.orbitControls.enableRotate = false
        ThreeViewControllerInstance.orbitControls.enablePan = false
        QubitEditorInstance.canEdit = QubitEditor.canEditEnumeration.QUBIT
    }


    /*_setPositiveInputButton() {
        const buttonId = "positive-input"
        this.positiveInputButton = this._setButton(buttonId, (event) => {
            this._setActive(event.target)
            ThreeViewControllerInstance.orbitControls.enableRotate = false
            ThreeViewControllerInstance.orbitControls.enablePan = false
            QubitEditorInstance.canEdit = QubitEditor.canEditEnumeration.POSITIVE_INPUT
        })
    }*/


    _setInputButton() {
        const buttonId = "negative-input"
        var self = this
        this.negativeInputButton = this._setButton(buttonId, (event) => {self._setNegativeInputButtonClick(event.target)})
    }
    _setNegativeInputButtonClick(target) {
        this._setActive(target)
        ThreeViewControllerInstance.orbitControls.enableRotate = false
        ThreeViewControllerInstance.orbitControls.enablePan = false
        QubitEditorInstance.canEdit = QubitEditor.canEditEnumeration.NEGATIVE_INPUT
    }


    _setOutputButton() {
        const buttonId = "place-output"
        var self = this
        this.outputButton = this._setButton(buttonId, (event) => {self._setOutputButtonClick(event.target)})
    }
    _setOutputButtonClick(target) {
        this._setActive(target)
        ThreeViewControllerInstance.orbitControls.enableRotate = false
        ThreeViewControllerInstance.orbitControls.enablePan = false
        QubitEditorInstance.canEdit = QubitEditor.canEditEnumeration.OUTPUT
    }


    _setEraserButton() {
        const buttonId = "eraser"
        var self = this
        this.eraserButton = this._setButton(buttonId, (event) => {self._setEraserButtonClick(event.target)})
    }
    _setEraserButtonClick(target) {
        this._setActive(event.target)
        ThreeViewControllerInstance.orbitControls.enableRotate = false
        ThreeViewControllerInstance.orbitControls.enablePan = false
        QubitEditorInstance.canEdit = QubitEditor.canEditEnumeration.REMOVE
    }



    _setHistoryButtons() {
        this._updateHistoryButtons()
        var self = this
        document.getElementById('undo-button').onclick = function() {
            History.undo()
            self._updateHistoryButtons()
        }
        document.getElementById('redo-button').onclick = function() {
            History.redo()
           self._updateHistoryButtons()
        }
    }

    _updateHistoryButtons() {
        const undoBtn = document.getElementById('undo-button')
        const redoBtn = document.getElementById('redo-button')
        if(History.canUndo() && undoBtn.classList.contains("inactive")) undoBtn.classList.remove("inactive")
        else if(!History.canUndo() && !undoBtn.classList.contains("inactive")) undoBtn.classList.add("inactive")

        if(History.canRedo() && redoBtn.classList.contains("inactive")) redoBtn.classList.remove("inactive")
        else if(!History.canRedo() && !redoBtn.classList.contains("inactive")) redoBtn.classList.add("inactive")
    }


    _setDraggableTools() {
        this._dragAndDropToolControls = new DragAndDropControls(".draggable.tool", false)

        this._dragAndDropToolControls.onDragCallback(targetElement => {
            switch (targetElement.id) {
                case "get-camera": return QubitEditor.canEditEnumeration.NOTHING
                case "place-qubits": return QubitEditor.canEditEnumeration.QUBIT
                case "positive-input": return QubitEditor.canEditEnumeration.POSITIVE_INPUT
                case "negative-input": return QubitEditor.canEditEnumeration.NEGATIVE_INPUT
                case "place-output": return QubitEditor.canEditEnumeration.OUTPUT
                case "eraser": return QubitEditor.canEditEnumeration.REMOVE
            }
        })

        this._dragAndDropToolControls.onDropCallback( payload => {
            QubitEditorInstance.canEdit = payload
            QubitEditorInstance.edit()
        })
    }

    _setCameraJoystick() {
        this._joystickCameraControls = new JoystickCameraControls("joystick-control", "zoom-control", false)
    }

    
    // Speed buttons //
    
    _setPauseButton() {
		var button = document.getElementById("play-button")
		var pause = document.getElementById("pause-button-icon")
		var play = document.getElementById("play-button-icon")
		
		// unpaused by default
		play.style.display = "none"
		pause.style.display = "inline"
		
		button.onclick = function() {
			if(AppControllerInstance.pauseMode) { // is app paused ?
				AppControllerInstance.setRefreshRate(AppController.SPEED)
				AppControllerInstance.pauseMode = false
				
				play.style.display = "none"
				pause.style.display = "inline"
			}
			else {
				AppControllerInstance.pauseMode = true
				
				play.style.display = "inline"
				pause.style.display = "none"
			}
		}
	}
	
	_setSlowButton() {
		const button = document.getElementById("slow-button")
		button.onclick = function() {
			AppControllerInstance.pauseMode = false
			AppControllerInstance.setRefreshRate(AppController.SPEED_SLOW)
		}
	}
	
	_setFastButton() {
		const button = document.getElementById("fast-button")
		button.onclick = function() {
			AppControllerInstance.pauseMode = false
			AppControllerInstance.setRefreshRate(AppController.SPEED_FAST)
		}
	}
    _keydownHandler(event) {
        switch(event.keyCode) {
            case 81: // Q -> qubit
                this._setQubitButtonClick(document.getElementById('place-qubits'))
                break;
            case 79: // O -> output
                this._setOutputButtonClick(document.getElementById('place-output'))
                break;
            case 73: // I -> input
                this._setNegativeInputButtonClick(document.getElementById('negative-input'))
                break;
            case 77: // M -> move
            case 67: // C -> move
                this._setCameraButtonClick(document.getElementById('get-camera'))
                break;
            case 82: // R ->remove
                this._setEraserButtonClick(document.getElementById('eraser'))
                break;
        }
    }


    init() {
        this._setCameraButton()
        this._setQubitButton()
        this._setInputButton()
        this._setOutputButton()
        this._setEraserButton()
        this._setDraggableTools()

        this._setPauseButton()
        this._setSlowButton()
        this._setFastButton()

        this._setHistoryButtons()

        this._setCameraJoystick()

        window.addEventListener("keydown",ev => this._keydownHandler(ev))
    }

    constructor() {
        if (!ToolboxController.instance) {
            ToolboxController.instance = this
        } 

        return ToolboxController.instance
    }
}

const ToolboxControllerInstance = new ToolboxController()
