/*
    global
    Cursor
*/
/*
    exported
    Editor
    EditorInstance
*/

/**
 * @class Editor
 * @brief interprets mouse positions and calls edits on the Automata with the help of a cursor
 */
class Editor {

    /**
     * @brief calls action mapped to the Editor"s current mode
     * spits out any thrown error in console
     */
    edit() {
        if (!this.cursor.position) return
        try {
            switch (this.canEdit) {
                case Editor.modes.QUBIT:
                    AchievementManager.Get()
                        .obtained("firstStep")
                    UxSaverInstance.add("addQubit", this.cursor.position)
                    return AppControllerInstance.automata.addQubit(this.cursor.position)
                case Editor.modes.INPUT:
                    UxSaverInstance.add("addNegativeInput", this.cursor.position)
                    return AppControllerInstance.automata.addInput(this.cursor.position, false)
                case Editor.modes.OUTPUT:
                    UxSaverInstance.add("addOutput", this.cursor.position)
                    return AppControllerInstance.automata.addOutput(this.cursor.position)
                case Editor.modes.REMOVE:
                    UxSaverInstance.add("remove", this.cursor.position)
                    return AppControllerInstance.automata.removeBlock(this.cursor.position)
                case Editor.modes.BRIDGE:
                    UxSaverInstance.add("setBridge", this.cursor.position)
                    return AppControllerInstance.automata.makeBridge(this.cursor.position)
            }
        } catch (exception) {
            console.info(exception)
        }
    }

    /**
     * @brief Removes or cancels operations
     * Meant ot be called for dragging movements or on secondary clicks
     */
    quickErase() {
        if (this.canEdit == Editor.modes.BRIDGE) {
            //UxSaverInstance.add("abortBridge",this.cursor.position)
            AppControllerInstance.automata.abortBridge(this.cursor.position)
        } else if (this.canEdit != Editor.modes.NOTHING) {
            UxSaverInstance.add("remove", this.cursor.position)
            AppControllerInstance.automata.removeBlock(this.cursor.position)
        }
    }

    /**
     * @brief adds common elements in the automata
     * Meant ot be called for dragging movements or on secondary clicks in default build mode
     */
    quickEdit() {
        if (!this.cursor.position) return
        UxSaverInstance.add("addQubit", this.cursor.position)
        AppControllerInstance.automata
            .addQubit(this.cursor.position)
    }


    /**
     * @method init
     * @brief initialize the editor, sets all the event listeners
     * @requires AppControllerInstance.view to be set
     */
    init() {
        this._mouseState = new Object()
        this._firstLeftMove = new THREE.Vector3()

        this.canEdit = Editor.modes.NOTHING

        const domViewportElement = AppControllerInstance.view.renderer.domElement
        domViewportElement.addEventListener("mousemove", ev => this._mousemoveHandler(ev))
        domViewportElement.addEventListener("mouseup", ev => this._mouseUpHandler(ev))
        domViewportElement.addEventListener("mousedown", ev => this._mousedownHandler(ev))
        domViewportElement.addEventListener("wheel", ev => this._wheelHandler(ev))

        this.cursor = new Cursor()
    }


    _wheelHandler(event) {
        if (this.canEdit === Editor.modes.NOTHING) return
        this.cursor.update(event.clientX, event.clientY, this._ignoreScroll ? 0 : event.deltaY)
        if (event.deltaY != 0 && !this._ignoreScroll) {
            this._ignoreScroll = true
            setTimeout(() => this._ignoreScroll = false, 100)
        }
        event.stopPropagation()
    }

    _mouseUpHandler() {
        if (this._mouseState.left && !this._mouseState.dragging) this.edit()
        if (this._mouseState.right) this.quickErase()
        this._mouseState = {
            left: false,
            right: false,
            dragging: false
        }
        if (this.canEdit == Editor.modes.NOTHING)
            AppControllerInstance.view.renderer.domElement.style.cursor = "grab"
    }

    _mousedownHandler(event) {
        this._mouseState = {
            left: event.button == 0,
            right: event.button == 2,
        }
        if (this.canEdit == Editor.modes.NOTHING)
            AppControllerInstance.view.renderer.domElement.style.cursor = "grabbing"

        if (this._mouseState.right)
            this.quickErase()

        if (this._mouseState.left && this.canEdit == Editor.modes.REMOVE)
            this.quickErase()

        if (this._mouseState.left && this.canEdit == Editor.modes.QUBIT)
            this.quickEdit()
    }

    _mousemoveHandler(event) {
        const cursorMoved = this.cursor.update(event.clientX, event.clientY)
        if (!cursorMoved) return
        this._mouseState.dragging = true

        if (this._mouseState.right)
            this.quickErase()

        if (this._mouseState.left && this.canEdit == Editor.modes.REMOVE)
            this.quickErase()

        if (this._mouseState.left && this.canEdit == Editor.modes.QUBIT)
            this.quickEdit()
    }

    constructor() {
        if (!Editor.instance) {
            Editor.instance = this
        }

        return Editor.instance
    }
}

// eslint-disable-next-line no-unused-vars
const EditorInstance = new Editor()

Editor.modes = {
    NOTHING: 0,
    CAMERA: 0,
    QUBIT: 1,
    INPUT: 3,
    OUTPUT: 4,
    REMOVE: 5,
    BRIDGE: 6
}
Object.freeze(Editor.modes)