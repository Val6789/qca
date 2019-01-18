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

    _mousemoveHandler(event) {
        if (!this.grid) return

        // get mouse position
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

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
            let translation = intersection[0].point.sub(this.cursor.position).round()
            this.cursor.translateX(translation.x)
            this.cursor.translateZ(translation.z)
        }

        // if the cursor changed, call for a render
        if (this.cursor.visible != wasVisible || !this.cursor.position.equals(previousPosition)) {
            ThreeViewControllerInstance.shouldRender()
        }
    }

    _clickHandler() {
        try {
            switch (this.canEdit) {
                case QubitEditor.canEditEnumeration.QUBIT:
                    return AppControllerInstance.automata.addQubit(this.cursor.position)

                case QubitEditor.canEditEnumeration.NEGATIVE_INPUT:
                    return AppControllerInstance.automata.addInput(this.cursor.position, -1)

                case QubitEditor.canEditEnumeration.POSITIVE_INPUT:
                    return AppControllerInstance.automata.addInput(this.cursor.position, 1)

                case QubitEditor.canEditEnumeration.OUTPUT:
                    return AppControllerInstance.automata.addOutput(this.cursor.position)

                case QubitEditor.canEditEnumeration.REMOVE:
                    return AppControllerInstance.automata.removeBlock(this.cursor.position)
            }
        } catch (exception) {
            console.info(exception)
        }
    }


    _makeCursor() {
        // makes a box with parameters width, height, length
        let cursorgeometry = new THREE.BoxGeometry(QubitEditor.CURSOR_SIZE, QubitEditor.CURSOR_HEIGHT, QubitEditor.CURSOR_SIZE)

        // makes a flat color material
        let cursormaterial = new THREE.LineBasicMaterial({
            color: QubitEditor.CURSOR_COLOR
        })

        // Creates a contour of the box with the white material: that's our the cursor
        this.cursor = new THREE.LineSegments(new THREE.EdgesGeometry(cursorgeometry), cursormaterial)
        ThreeViewControllerInstance.addObjectToScene(this.cursor)
    }


    _makeGrid() {
        this.grid = new Grid(AssetManager.Get().fonts.optimer, -QubitEditor.CURSOR_HEIGHT / 2)
        ThreeViewControllerInstance.addObjectToScene(this.grid.object)
        ThreeViewControllerInstance.callbackOnRender(() => {
            this.grid.lookCamera(ThreeViewControllerInstance.camera.position)
        })
    }


    init() {
        document.addEventListener("mousemove", ev => this._mousemoveHandler(ev))
        document.addEventListener("mouseup", () => this._clickHandler())

        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()
        this.camera = ThreeViewControllerInstance.camera
        this.canEdit = QubitEditor.canEditEnumeration.NOTHING

        this._makeCursor()
        this._makeGrid()
    }

    constructor() {
        if (!QubitEditor.instance) {
            QubitEditor.instance = this
        }

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