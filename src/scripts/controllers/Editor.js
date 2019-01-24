/*
    global
    Grid
*/
/*
    exported
    Editor
    EditorInstance
*/

class Editor {
    edit() {
        try {
            switch (this.canEdit) {
                case Editor.modes.QUBIT:
                    UxSaverInstance.add('addQubit',this.cursor.position)
                    return AppControllerInstance.automata.addQubit(this.cursor.position)
                case Editor.modes.NEGATIVE_INPUT:
                    UxSaverInstance.add('addNegativeInput',this.cursor.position)
                    return AppControllerInstance.automata.addInput(this.cursor.position, false)
                case Editor.modes.POSITIVE_INPUT:
                    UxSaverInstance.add('addPositiveInput',this.cursor.position)
                    return AppControllerInstance.automata.addInput(this.cursor.position, true)
                case Editor.modes.OUTPUT:
                    UxSaverInstance.add('addOutput',this.cursor.position)
                    return AppControllerInstance.automata.addOutput(this.cursor.position)
                case Editor.modes.REMOVE:
                    UxSaverInstance.add('remove',this.cursor.position)
                    return AppControllerInstance.automata.removeBlock(this.cursor.position)
                case Editor.modes.BRIDGE:
                    UxSaverInstance.add('setBridge',this.cursor.position)
                    return AppControllerInstance.automata.makeBridge(this.cursor.position)
            }
        } catch (exception) {
            console.info(exception)
        }
    }

    init() {
        this._mouseState = new Object()
        this._firstLeftMove = new THREE.Vector3()

        this.canEdit = Editor.modes.NOTHING

        const domViewportElement = ThreeViewControllerInstance.renderer.domElement
        domViewportElement.addEventListener("mousemove", ev => this._mousemoveHandler(ev))
        domViewportElement.addEventListener("mouseup", ev => this._mouseUpHandler(ev))
        domViewportElement.addEventListener("mousedown", ev => this._mousedownHandler(ev))
        domViewportElement.addEventListener("mousemove", ev => this._mousemoveHandler(ev))
        domViewportElement.addEventListener("wheel", ev => this._wheelHandler(ev))

        this.cursor = new Cursor()
    }

    _wheelHandler(event) {
        if (!this._mousePosition || this.canEdit === Editor.modes.NOTHING) return
        this.cursor.update(this._mousePosition.clientX, this._mousePosition.clientY, Math.sign(event.deltaY))
        event.stopPropagation()
    }

    _mouseUpHandler(event) {
        if (this._leftClickDown) this._leftClickDown = false
        if (this._rightClickDown) this._rightClickDown = false
        if (event.button == 0)
            this.edit()
        else if (event.button == 2 && this.canEdit)
            return AppControllerInstance.automata.removeBlock(this.cursor.position)
    }


    _mousedownHandler(event) {
        if (event.button == 0) {
            this._leftClickDown = true
            this._firstLeftMove.copy(this.cursor.position)
        } else if (event.button == 2) {
            this._rightClickDown = true
        }
    }

    _mousemoveHandler(event) {
        this._mousePosition = event
        if (this.cursor.update(event.clientX, event.clientY)) {
            if (this._rightClickDown) {
                AppControllerInstance.automata.abortBridge()
                if (this.canEdit || this._leftClickDown && this.canEdit == Editor.modes.REMOVE)
                    AppControllerInstance.automata.removeBlock(this.cursor.position)
            } else if (this._leftClickDown && this.canEdit == Editor.modes.QUBIT) {
                AppControllerInstance.automata.addQubit(this.cursor.position)
            }
        }
    }

    constructor() {
        if (!Editor.instance) {
            Editor.instance = this
        }

        return Editor.instance
    }
}

const EditorInstance = new Editor()

Editor.modes = {
    NOTHING: 0,
    QUBIT: 1,
    POSITIVE_INPUT: 2,
    NEGATIVE_INPUT: 3,
    OUTPUT: 4,
    REMOVE: 5,
    BRIDGE: 6
}