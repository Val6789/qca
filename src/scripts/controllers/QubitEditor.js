/*
    global
    THREE
    Qubit
    Grid
    AssetManager
    ThreeViewControllerInstance
    InputBlock
*/
/*
    exported
    QubitEditor
*/

class QubitEditor {

    callbackOnCursorMove(callback) {
        this.cursorMoveCallbacks.push(callback)
    }

    edit() {
        try {
            switch (this.canEdit) {
                case QubitEditor.canEditEnumeration.QUBIT:
                    return AppControllerInstance.automata.addQubit(this.cursor.position)
                case QubitEditor.canEditEnumeration.NEGATIVE_INPUT:
                    return AppControllerInstance.automata.addInput(this.cursor.position, false)
                case QubitEditor.canEditEnumeration.POSITIVE_INPUT:
                    return AppControllerInstance.automata.addInput(this.cursor.position, true)
                case QubitEditor.canEditEnumeration.OUTPUT:
                    return AppControllerInstance.automata.addOutput(this.cursor.position)
                case QubitEditor.canEditEnumeration.REMOVE:
                    return AppControllerInstance.automata.removeBlock(this.cursor.position)
            }
        } catch (exception) {
            console.info(exception)
        }
    }

    updateCursor(screenX, screenY, wheelDelta = 0) {
        if (!this.grid) return

        // get mouse position
        this.mouse.x = (screenX / window.innerWidth) * 2 - 1
        this.mouse.y = -(screenY/ window.innerHeight) * 2 + 1

        // cast ray from the camera, through the cursor
        this.raycaster.setFromCamera(this.mouse, this.camera)

        // save previous mouse state
        const wasVisible = this.cursor.visible
        const previousPosition = this.cursor.position.clone

        // collect detected intersections
        let intersection = this.raycaster.intersectObject(this.grid.hitzone)

        // set the cursor to visible if there is an intersection
        this.cursor.visible = intersection.length != 0

        // for that intersection
        if (intersection[0]) {
            // move the cursor there
            let translation = intersection[0].point
            translation.y += this.cursor.position.y + wheelDelta
            translation.sub(this.cursor.position).round()
            this.cursor.position.add(translation)
        }

        // if the cursor changed, call for a render
        if (this.cursor.visible != wasVisible || !this.cursor.position.equals(previousPosition)) {
            this._updateYColumn()
            this.cursorMoveCallbacks.forEach( callback => callback(this.cursor.position))
            ThreeViewControllerInstance.shouldRender()
            return true
        }
        return false
    }

    _updateYColumn() {
        this._yColumn.position.copy(this.cursor.position)
        this._yColumn.scale.y = Math.ceil(this.cursor.position.y - QubitEditor.CURSOR_HEIGHT / 2)
        this._yColumn.position.y = (this.cursor.position.y) / 2 - QubitEditor.CURSOR_HEIGHT / 2
        this._yColumn.visible = this._yColumn.scale.y != 0
    }

    _wheelHandler(event) {
        if (!this._mousePosition || this.canEdit === QubitEditor.canEditEnumeration.NOTHING) return
        this.updateCursor(this._mousePosition.clientX, this._mousePosition.clientY, Math.sign(event.deltaY))
        event.stopPropagation()
    }

    _mousemoveHandler(event) {
        this._mousePosition = event
        if (this.updateCursor(event.clientX, event.clientY)) {
            if (this._rightClickDown && this.canEdit || this._leftClickDown && this.canEdit == QubitEditor.canEditEnumeration.REMOVE)
                AppControllerInstance.automata.removeBlock(this.cursor.position)
            else if (this._leftClickDown && this.canEdit == QubitEditor.canEditEnumeration.QUBIT)
                AppControllerInstance.automata.addQubit(this.cursor.position)
        }
    }

    _clickHandler(event) {
        if (this._leftClickDown) this._leftClickDown = false;
        if (this._rightClickDown) this._rightClickDown = false;
        if (event.button == 0)
            this.edit()
        else if (event.button == 2 && this.canEdit)
            return AppControllerInstance.automata.removeBlock(this.cursor.position)
    }

    _makeCursor() {
        // makes a box with parameters width, height, length
        let cursorgeometry = new THREE.BoxGeometry(QubitEditor.CURSOR_SIZE, QubitEditor.CURSOR_HEIGHT, QubitEditor.CURSOR_SIZE)
        let yColumnGeometry = new THREE.BoxGeometry(QubitEditor.CURSOR_SIZE, QubitEditor.CURSOR_SIZE, QubitEditor.CURSOR_SIZE)

        // makes a flat color material
        let cursormaterial = new THREE.LineBasicMaterial({
            color: QubitEditor.CURSOR_COLOR
        })

        // Creates a contour of the box with the white material: that's our the cursor
        this.cursor = new THREE.LineSegments(new THREE.EdgesGeometry(cursorgeometry), cursormaterial)
        this._yColumn = new THREE.LineSegments(new THREE.EdgesGeometry(yColumnGeometry), cursormaterial)
        ThreeViewControllerInstance.addObjectToScene(this._yColumn)
        ThreeViewControllerInstance.addObjectToScene(this.cursor)
    }


    _makeGrid() {
        this.grid = new Grid(AssetManager.Get().fonts.optimer, -QubitEditor.CURSOR_HEIGHT / 2)
        ThreeViewControllerInstance.addObjectToScene(this.grid.object)
    }

    _mousedownHandler(event) {
        if (event.button == 0)
        {
            this._leftClickDown = true;
            this._firstLeftMove.copy(this.cursor.position)
        }
        else if (event.button == 2)
        {
            this._rightClickDown = true;
        }
    }

    init() {
        const domViewportElement = ThreeViewControllerInstance.renderer.domElement
        domViewportElement.addEventListener("mousemove", ev => this._mousemoveHandler(ev))
        domViewportElement.addEventListener("mouseup", ev => this._clickHandler(ev))
        domViewportElement.addEventListener("mousedown", ev => this._mousedownHandler(ev))
        domViewportElement.addEventListener("mousemove", ev => this._mousemoveHandler(ev))
        domViewportElement.addEventListener("wheel", ev => this._wheelHandler(ev))

        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()
        this.camera = ThreeViewControllerInstance.camera
        this.canEdit = QubitEditor.canEditEnumeration.NOTHING
        this.cursorMoveCallbacks = new Array()

        this._makeCursor()
        this._makeGrid()

        this._updateYColumn()
    }

    constructor() {
        if (!QubitEditor.instance) {
            QubitEditor.instance = this
        }
        this._leftClickDown = false;
        this._rightClickDown = false;
        this._firstLeftMove = new THREE.Vector3()
        return QubitEditor.instance
    }
}

const QubitEditorInstance = new QubitEditor()

QubitEditor.CURSOR_SIZE = 1
QubitEditor.CURSOR_HEIGHT = 0.3
QubitEditor.CURSOR_COLOR = 0x999999

QubitEditor.canEditEnumeration = {
    NOTHING: 0,
    QUBIT: 1,
    POSITIVE_INPUT: 2,
    NEGATIVE_INPUT: 3,
    OUTPUT: 4,
    REMOVE: 5
}