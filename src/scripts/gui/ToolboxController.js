/*
    global
    QubitEditor
    AppController
    DragAndDropControls
    OverlaySelector
    JoystickCameraControls
    UIControllerInstance
*/
/*
    exported
    ToolboxController
    ToolboxControllerInstance
*/

/**
 * @warning THIS IS NOT YOUR TOOLBOX CONTROLLER. WHAT USED TO BE TOOLBOX CONTROLLER IS NOW UICONTROLLER!
 * @class ToolBoxController
 */
class ToolboxController {
    /**
     * @brief set the editor to use the tool matching given element id
     * @param {String} toolID id of the tool dom Element
     */
    select(toolID) {
        // save tool states
        this.previousTool = this.activeTool
        this.activeTool = toolID

        // update selection display on the toolbox DOM
        this.toolsDomElements.forEach( element => {
            element.classList.toggle("active", element.id === toolID)
        })

        // setup tool interaction settings
        this._toggleCameraControl(toolID)
        this._toggleMagneticCursor(toolID)
        this._selectEditorMode(toolID)
    }

    /**
     * @brief toggles camera movement
     * @param {String} toolID button id
     */
    _toggleCameraControl(toolID){
        switch (toolID) {
            case "camera-tool":
            if(ToolboxController.CONSOLE_OUTPUT) console.log("Free camera")
            ThreeViewControllerInstance.orbitControls.enableRotate = true
            ThreeViewControllerInstance.orbitControls.enablePan = true
            break

            case "qubit-tool":
            case "input-tool":
            case "output-tool":
            case "remove-tool":
            case "bridge-tool":
            if(ToolboxController.CONSOLE_OUTPUT) console.log("Locked camera")
            ThreeViewControllerInstance.orbitControls.enableRotate = false
            ThreeViewControllerInstance.orbitControls.enablePan = false
            break

            default: break
        }
    }

    /**
     * @brief toggles the editor cursor magnetism (jumping to the closest block)
     * @param {String} toolID button id
     */
    _toggleMagneticCursor(toolID){
        switch (toolID) {
            case "bridge-tool":
            case "camera-tool":
            if(ToolboxController.CONSOLE_OUTPUT) console.log("Enabled Magnetic cursor")
            EditorInstance.cursor.isMagnetic = false
            break

            case "qubit-tool":
            case "input-tool":
            case "output-tool":
            case "remove-tool":
            if(ToolboxController.CONSOLE_OUTPUT) console.log("Disabled Magnetic cursor")
            EditorInstance.cursor.isMagnetic = false
            break

            default: break
        }
    }

    /**
     * @brief matches button to editor mode
     * @param {String} toolID button id
     */
    _selectEditorMode(toolID){
        switch (toolID) {
            case "qubit-tool":
            UxSaverInstance.add('setQbitToolClick')
            EditorInstance.canEdit = Editor.modes.QUBIT
            break

            case "input-tool":
            UxSaverInstance.add('setInputToolClick')
            EditorInstance.canEdit = Editor.modes.INPUT
            break

            case "output-tool":
            UxSaverInstance.add('setOutbutToolClick')
            EditorInstance.canEdit = Editor.modes.OUTPUT
            break

            case "remove-tool":
            UxSaverInstance.add('setEraserToolClick')
            EditorInstance.canEdit = Editor.modes.REMOVE
            break

            case "bridge-tool":
            UxSaverInstance.add('setBridgeToolClick')
            EditorInstance.canEdit = Editor.modes.BRIDGE
            break

            case "camera-tool":
            UxSaverInstance.add('setCameraToolClick')
            EditorInstance.canEdit = Editor.modes.NOTHING
            
            default: break
        }
        if(ToolboxController.CONSOLE_OUTPUT) console.log("tool:", toolID, EditorInstance.canEdit)
    }

    /**
     * @constructor
     * @param {String} toolClassName css class name identifing tools
     */
    constructor(toolClassName = "tool") {
        this.toolsDomElements = document.querySelectorAll(`.${toolClassName}`)
        this.toolsDomElements.forEach(element => {
            element.addEventListener("click", event => {
                this.select(event.currentTarget.id)
            })
        })
    }
}

// toggles console logging of tool configurations 
ToolboxController.CONSOLE_OUTPUT = true