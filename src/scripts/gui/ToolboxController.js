/* 
    global
    QubitEditor
    AppController
    DragAndDropControls
    OverlaySelector
    JoystickCameraControls
*/
/* 
    exported 
    ToolboxController
    ToolboxControllerInstance
*/

class ToolboxController {


    // Tool buttons //
    // =================== Choice Holder ===================

    revealChoice() {
        if (!this.$choiceHolder)
            this.$choiceHolder = document.getElementById("choice-holder")

        this.$choiceHolder.classList.remove("hidden")
    }
    
    hideChoice() {
        if (!this.$choiceHolder)
            this.$choiceHolder = document.getElementById("choice-holder")

        this.$choiceHolder.classList.add("hidden")
    }
    
    choiceClick() {
        if (!this.$choiceHolder)
            this.$choiceHolder = document.getElementById("choice-holder")
        const $tutorial = this.$choiceHolder.children.namedItem("choice-tutorial")
        const $sandbox = this.$choiceHolder.children.namedItem("choice-sandbox")
        
        console.log($tutorial)
        
        let promises = [
            new Promise((resolve) => {
                $tutorial.onclick = () => {
                    resolve("tutorial")
                }
            }),
            new Promise((resolve) => {
                $sandbox.onclick = () => {
                    resolve("sandbox")
                }
            })
        ]
        return Promise.race(promises)
    }

    // =================== Info Holder ===================
    hideInfoHolder() {
        if (!this.$infoHolder)
            this.$infoHolder = document.getElementById("info-holder")

        this.$infoHolder.classList.add("info-holder-hidden")
    }

    revealInfoHolder() {
        if (!this.$infoHolder)
            this.$infoHolder = document.getElementById("info-holder")

        this.$infoHolder.classList.remove("info-holder-hidden")
    }

    addInfoHolderText(text) {
        if (!this.$infoHolder)
            this.$infoHolder = document.getElementById("info-holder")
        const p = document.createElement("p")
        p.innerHTML = text
        this.$infoHolder.children[1].appendChild(p)
    }

    setInfoHolderTitle(title) {
        if (!this.$infoHolder)
            this.$infoHolder = document.getElementById("info-holder")

        const $title = this.$infoHolder.children[0]
        $title.innerText = title
    }

    clearInfoHolder() {
        if (!this.$infoHolder)
            this.$infoHolder = document.getElementById("info-holder")
        const node = this.$infoHolder.children[1]
        while (node.firstChild) {
            node.removeChild(node.firstChild)
        }

    }

    setInfoHolderNextClickCallback(callback) {
        if (!this.$infoHolder)
            this.$infoHolder = document.getElementById("info-holder")
        this.$infoHolder.children[2].onclick = callback
    }

    // =================== UI ===================
    revealUI() {
        if (!this.$ui)
            this.$ui = document.querySelectorAll(".ui")
        this.$ui.forEach(ui => {
            ui.classList.remove("hidden")
        })
    }

    hideUI() {
        if (!this.$ui)
            this.$ui = document.querySelectorAll(".ui")

        this.$ui.forEach(ui => {
            ui.classList.add("hidden")
        })

    }


    // =================== OTHER ===================

    _setButton(id, callback) {
        var button = document.getElementById(id)
        button.addEventListener("mouseup", event => {
            callback(event)
            event.stopPropagation()
        }, false)
        return button
    }


    _setActive(element) {
        let lastActive = element.parentNode.getElementsByClassName("active")
        if (lastActive.length > 0) lastActive[0].classList.remove("active")
        element.classList.add("active")
    }


    _setCameraButton() {
        const buttonId = "get-camera"
        var self = this
        this.cameraButton = this._setButton(buttonId, event => {
            self._setCameraButtonClick(event.target)
        })
    }
    _setCameraButtonClick(target) {
        this._setActive(target)
        ThreeViewControllerInstance.orbitControls.enableRotate = true
        ThreeViewControllerInstance.orbitControls.enablePan = true
        QubitEditorInstance.canEdit = QubitEditor.canEditEnumeration.NOTHING
    }


    _setQubitButton() {
        const buttonId = "place-qubits"
        var self = this
        this.qubitButton = this._setButton(buttonId, (event) => {
            self._setQubitButtonClick(event.target)
        })
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
        this.negativeInputButton = this._setButton(buttonId, (event) => {
            self._setNegativeInputButtonClick(event.target)
        })
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
        this.outputButton = this._setButton(buttonId, (event) => {
            self._setOutputButtonClick(event.target)
        })
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
        this.eraserButton = this._setButton(buttonId, (event) => {
            self._setEraserButtonClick(event.target)
        })
    }
    _setEraserButtonClick(target) {
        this._setActive(target)
        ThreeViewControllerInstance.orbitControls.enableRotate = false
        ThreeViewControllerInstance.orbitControls.enablePan = false
        QubitEditorInstance.canEdit = QubitEditor.canEditEnumeration.REMOVE
    }

    _setHistoryButtons() {
        this._updateHistoryButtons()
        var self = this
        document.getElementById("undo-button").onclick = function () {
            History.undo()
            self._updateHistoryButtons()
        }
        document.getElementById("redo-button").onclick = function () {
            History.redo()
            self._updateHistoryButtons()
        }
    }

    _updateHistoryButtons() {
        const undoBtn = document.getElementById("undo-button")
        const redoBtn = document.getElementById("redo-button")
        if (History.canUndo() && undoBtn.classList.contains("inactive")) undoBtn.classList.remove("inactive")
        else if (!History.canUndo() && !undoBtn.classList.contains("inactive")) undoBtn.classList.add("inactive")

        if (History.canRedo() && redoBtn.classList.contains("inactive")) redoBtn.classList.remove("inactive")
        else if (!History.canRedo() && !redoBtn.classList.contains("inactive")) redoBtn.classList.add("inactive")
    }


    _setDraggableTools() {
        this._dragAndDropToolControls = new DragAndDropControls(".draggable.tool", false)

        this._dragAndDropToolControls.onDragCallback(targetElement => {
            switch (targetElement.id) {
                case "get-camera":
                    return QubitEditor.canEditEnumeration.NOTHING
                case "place-qubits":
                    return QubitEditor.canEditEnumeration.QUBIT
                case "positive-input":
                    return QubitEditor.canEditEnumeration.POSITIVE_INPUT
                case "negative-input":
                    return QubitEditor.canEditEnumeration.NEGATIVE_INPUT
                case "place-output":
                    return QubitEditor.canEditEnumeration.OUTPUT
                case "eraser":
                    return QubitEditor.canEditEnumeration.REMOVE
            }
        })

        this._dragAndDropToolControls.onDropCallback(payload => {
            QubitEditorInstance.canEdit = payload
            QubitEditorInstance.edit()
        })
    }

    _setCameraJoystick() {
        this._joystickCameraControls = new JoystickCameraControls("joystick-control", "zoom-control", false)
    }


    _setOverlaySelector() {
        this._overlaySelector = new OverlaySelector()
    }

    // Speed buttons //

    _setPauseButton() {
        var button = document.getElementById("play-button")
        var pause = document.getElementById("pause-button-icon")
        var play = document.getElementById("play-button-icon")

        // unpaused by default
        play.style.display = "none"
        pause.style.display = "inline"

        button.onclick = function () {
            if (AppControllerInstance.pauseMode) { // is app paused ?
                AppControllerInstance.setRefreshRate(AppController.SPEED)
                AppControllerInstance.pauseMode = false

                play.style.display = "none"
                pause.style.display = "inline"
            } else {
                AppControllerInstance.pauseMode = true

                play.style.display = "inline"
                pause.style.display = "none"
            }
        }
    }

    _setSlowButton() {
        const button = document.getElementById("slow-button")
        button.onclick = function () {
            AppControllerInstance.pauseMode = false
            AppControllerInstance.setRefreshRate(AppController.SPEED_SLOW)
        }
    }

    _setFastButton() {
        const button = document.getElementById("fast-button")
        button.onclick = function () {
            AppControllerInstance.pauseMode = false
            AppControllerInstance.setRefreshRate(AppController.SPEED_FAST)
        }
    }
    _keydownHandler(event) {
        switch (event.keyCode) {
            case 81: // Q -> qubit
            case 75: // K
                this._setToolWithId("place-qubits")
                break
            case 79: // O -> output
                this._setToolWithId("place-output")
                break
            case 73: // I -> input
                this._setToolWithId("negative-input")
                break
            case 77: // M -> move
            case 67: // C
                this._setToolWithId("get-camera")
                break
            case 82: // R ->remove
                this._setToolWithId("eraser")
                break
            case 16: // Maj
            case 32: // Space
                this.lastToolSelected = this.currentToolSelected
                this._setToolWithId("get-camera")
                break
            case 9: // Tab
                this._setToolWithId(ToolboxController.buttonIdList[(ToolboxController.buttonIdList.indexOf(this.currentToolSelected) + 1) % ToolboxController.buttonIdList.length])
                event.stopPropagation()
                event.preventDefault()
                break
        }
    }
    _keyupHandler(event) {
        switch (event.keyCode) {
            case 16: // Maj
            case 32: // Space
                this._setToolWithId(this.lastToolSelected)
                break
        }

    }

    _setToolWithId(id) {
        this.currentToolSelected = id
        switch (id) {
            case "place-qubits":
                this._setQubitButtonClick(document.getElementById("place-qubits"))
                break
            case "place-output":
                this._setOutputButtonClick(document.getElementById("place-output"))
                break
            case "negative-input":
                this._setNegativeInputButtonClick(document.getElementById("negative-input"))
                break
            case "get-camera":
                this._setCameraButtonClick(document.getElementById("get-camera"))
                break
            case "eraser":
                this._setEraserButtonClick(document.getElementById("eraser"))
                break
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
        this._setOverlaySelector()

        this.currentToolSelected = "get-camera"
        this.lastToolSelected = ""

        window.addEventListener("keydown", ev => this._keydownHandler(ev))
        window.addEventListener("keyup", ev => this._keyupHandler(ev))
    }

    constructor() {
        if (!ToolboxController.instance) {
            ToolboxController.instance = this
        }

        return ToolboxController.instance
    }
}

const ToolboxControllerInstance = new ToolboxController()
ToolboxController.buttonIdList = ["get-camera", "negative-input", "place-qubits", "place-output", "eraser"]
