/* global THREE:true, QubitEditor:true */
/* exported ToolboxController */

class ToolboxController {
	// Tool buttons //
	
    _setButton(id, callback) {
        var button = document.getElementById(id)
        button.addEventListener("click", event => {
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
        this.cameraButton = this._setButton(buttonId, (event) => {
            this._setActive(event.target)
            ThreeViewControllerInstance.orbitControls.enableRotate = true
            ThreeViewControllerInstance.orbitControls.enablePan = true
            QubitEditorInstance.canEdit = QubitEditor.canEditEnumeration.NOTHING
        })
    }


    _setQubitButton() {
        const buttonId = "place-qubits"
        this.qubitButton = this._setButton(buttonId, (event) => {
            this._setActive(event.target)
            ThreeViewControllerInstance.orbitControls.enableRotate = false
            ThreeViewControllerInstance.orbitControls.enablePan = false
            QubitEditorInstance.canEdit = QubitEditor.canEditEnumeration.QUBIT
        })
    }


    _setPositiveInputButton() {
        const buttonId = "positive-input"
        this.positiveInputButton = this._setButton(buttonId, (event) => {
            this._setActive(event.target)
            ThreeViewControllerInstance.orbitControls.enableRotate = false
            ThreeViewControllerInstance.orbitControls.enablePan = false
            QubitEditorInstance.canEdit = QubitEditor.canEditEnumeration.POSITIVE_INPUT
        })
    }


    _setNegativeInputButton() {
        const buttonId = "negative-input"
        this.negativeInputButton = this._setButton(buttonId, (event) => {
            this._setActive(event.target)
            ThreeViewControllerInstance.orbitControls.enableRotate = false
            ThreeViewControllerInstance.orbitControls.enablePan = false
            QubitEditorInstance.canEdit = QubitEditor.canEditEnumeration.NEGATIVE_INPUT
        })
    }


    _setOutputButton() {
        const buttonId = "place-output"
        this.outputButton = this._setButton(buttonId, (event) => {
            this._setActive(event.target)
            ThreeViewControllerInstance.orbitControls.enableRotate = false
            ThreeViewControllerInstance.orbitControls.enablePan = false
            QubitEditorInstance.canEdit = QubitEditor.canEditEnumeration.OUTPUT
        })
    }


    _setEraserButton() {
        const buttonId = "eraser"
        this.eraserButton = this._setButton(buttonId, (event) => {
            this._setActive(event.target)
            ThreeViewControllerInstance.orbitControls.enableRotate = false
            ThreeViewControllerInstance.orbitControls.enablePan = false
            QubitEditorInstance.canEdit = QubitEditor.canEditEnumeration.REMOVE
        })
    }

	// Checkboxes //
    
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


    _setDraggableTools() {
        const tools = document.querySelectorAll(".draggable.tool")
        tools.forEach( tool => {
            tool.addEventListener("touchstart", event => this._initiateDrag(event))
            tool.addEventListener("touchmove", event => this._updateDrag(event))
            tool.addEventListener("touchend", event => this._executeDrop(event))
        })
        this._currentDragPlayload = undefined
    }

    _initiateDrag(event) {
        ThreeViewControllerInstance.orbitControls.enableRotate = false
        ThreeViewControllerInstance.orbitControls.enablePan = false
        if (this._currentDragPlayload) document.body.removeChild(this._currentDragPlayload.domElement)

        var item
        switch (event.currentTarget.id) {
            case "get-camera":
                item = QubitEditor.canEditEnumeration.NOTHING
                break;
            case "place-qubits":
                item = QubitEditor.canEditEnumeration.QUBIT
                break;
            case "positive-input":
                item = QubitEditor.canEditEnumeration.POSITIVE_INPUT
                break;
            case "negative-input":
                item = QubitEditor.canEditEnumeration.NEGATIVE_INPUT
                break;
            case "place-output":
                item = QubitEditor.canEditEnumeration.OUTPUT
                break;
            case "eraser":
                item = QubitEditor.canEditEnumeration.REMOVE
                break;
        }

        this._currentDragPlayload = {
            item: item,
            domElement: document.body.appendChild(event.currentTarget.cloneNode(true))
        }
    }

    _updateDrag(event) {
        const touch = event.touches.item(0)
        QubitEditorInstance.updateCursor(touch.clientX, touch.clientY)
        if (this._currentDragPlayload) this._currentDragPlayload.domElement.style.cssText = `
            position: fixed;
            z-index: 100000;
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.9;
            border: solid 3px yellow;
            left: ${event.touches.item(0).clientX}px;
            top: ${event.touches.item(0).clientY}px;`
    }

    _executeDrop(event) {
        ThreeViewControllerInstance.orbitControls.enableRotate = true
        ThreeViewControllerInstance.orbitControls.enablePan = true
        if (this._currentDragPlayload) {
            QubitEditorInstance.canEdit = this._currentDragPlayload.item
            QubitEditorInstance.edit()
            document.body.removeChild(this._currentDragPlayload.domElement)
        }
        this._currentDragPlayload = null;
    }

    _setZoomSlider() {
        const button = document.getElementById("zoom-control");

        const onSliderChange = event => {
            const zoom = parseInt(event.currentTarget.value)
            const currentzoom = ThreeViewControllerInstance.camera.position.distanceTo(ThreeViewControllerInstance.orbitControls.target)
            ThreeViewControllerInstance.camera.translateZ(zoom - currentzoom)

            // update controls
            ThreeViewControllerInstance.orbitControls.update()
            ThreeViewControllerInstance.shouldRender()
            event.stopPropagation()

            console.log("hello")
        }

        button.addEventListener("mousedown", ev => ev.stopPropagation())
        button.addEventListener("mousemove", onSliderChange)
        button.addEventListener("touchmove", onSliderChange)


        ThreeViewControllerInstance.callbackOnRender(() => {
            const currentzoom = ThreeViewControllerInstance.camera.position.distanceTo(ThreeViewControllerInstance.orbitControls.target)
            button.value = currentzoom
        })
    }


    _setCameraJoystick() {
        const button = document.getElementById("joystick-control")
        var centerX = button.offsetLeft + button.clientWidth / 2
        var centerY = button.offsetTop + button.clientHeight / 2
        const radius = Math.hypot(button.clientWidth, button.clientHeight)

        console.log( centerX, centerY)

        const onJoystick = (x,y) => {
            const translation = new THREE.Vector3(centerX - x, 0, centerY - y)
            if (radius < translation.length()) return
            ThreeViewControllerInstance.camera.position.add(translation)

            console.log(ThreeViewControllerInstance.camera.position, translation)

            ThreeViewControllerInstance.orbitControls.update()
            ThreeViewControllerInstance.shouldRender()
        }

        button.addEventListener("touchmove", event => {
            const touch = event.touches.item(0)
            onJoystick(touch.clientX, touch.clientY)
            event.stopPropagation()
        })

        button.addEventListener("mousemove", event => {
            if(event.buttons === 1) {
                onJoystick(event.clientX, event.clientY)
                event.stopPropagation()
            }
        })
    }

    
    // Speed buttons //
    
    _setPauseButton() {
		var button = document.getElementById("play-button")
		button.onclick = function() {
			AppControllerInstance.setRefreshRate(AppController.SPEED)
			AppControllerInstance.setPause()
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
    

    init() {
        this._setCameraButton()
        this._setQubitButton()
        this._setNegativeInputButton()
        this._setPositiveInputButton()
        this._setOutputButton()
        this._setEraserButton()
        this._setDraggableTools()
        
        this._setPauseButton()
        this._setSlowButton()
        this._setFastButton()

        this._setZoomSlider()
        this._setCameraJoystick()
    }

    constructor() {
        if (!ToolboxController.instance) {
            ToolboxController.instance = this
        } 

        return ToolboxController.instance
    }
}

const ToolboxControllerInstance = new ToolboxController()
