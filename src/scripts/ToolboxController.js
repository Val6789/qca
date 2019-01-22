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

            tool.addEventListener("mousedown", event => this._initiateDrag(event))
            document.addEventListener("mousemove", event => this._updateDrag(event))
            document.addEventListener("mouseup", event => this._executeDrop(event))
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
        var pointer
        if (event instanceof TouchEvent)
            pointer = event.touches.item(0)
        else
            pointer = event

        console.log(pointer.clientX, pointer.clientY)

        QubitEditorInstance.updateCursor(pointer.clientX, pointer.clientY)
        if (this._currentDragPlayload) this._currentDragPlayload.domElement.style.cssText = `
            position: fixed;
            z-index: 100000;
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.9;
            border: solid 3px yellow;
            left: ${pointer.clientX}px;
            top: ${pointer.clientY}px;`
    }

    _executeDrop() {
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
        const up = new THREE.Vector3(0,1,0)
        var centerX = button.offsetLeft + button.clientWidth / 2
        var centerY = button.offsetTop + button.clientHeight / 2
        const radius = Math.hypot(button.clientWidth, button.clientHeight)
        var pointerBuffer = null


        function apply() {
            if (pointerBuffer) requestAnimationFrame(apply); else return
            var translate = new THREE.Vector3(pointerBuffer.clientX - centerX, 0, pointerBuffer.clientY - centerY)
            if (translate.length > radius) return

            const cameraOrientation = ThreeViewControllerInstance.camera.getWorldQuaternion()
            translate.multiplyScalar(0.01)
            translate.applyQuaternion(cameraOrientation)
            translate.projectOnPlane(up)
            console.log(translate, up, cameraOrientation)


            ThreeViewControllerInstance.orbitControls.target.add(translate)
            ThreeViewControllerInstance.camera.position.add(translate)

            ThreeViewControllerInstance.orbitControls.update()
            ThreeViewControllerInstance.shouldRender()
        }

        function update(pointer) { pointerBuffer = pointer}
        function start(pointer) {
            update(pointer)
            requestAnimationFrame(apply)
        }
        function end() { pointerBuffer = null }


        button.addEventListener("mousedown", event => { start(event); event.stopPropagation() })
        button.addEventListener("mousemove", event => { update(event); event.stopPropagation()  })
        button.addEventListener("mouseup", event => { end(); event.stopPropagation() })

        button.addEventListener("touchstart", event => { start(event.touches.item(0)); event.stopPropagation()  })
        button.addEventListener("touchmove", event => { update(event.touches.item(0)); event.stopPropagation()  })
        button.addEventListener("touchend", event => { end(); event.stopPropagation() })
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
