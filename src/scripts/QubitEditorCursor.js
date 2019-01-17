/* global THREE:true, Qubit:true, Grid:true, AssetManager:true */
/* exported QubitEditorCursor */

class QubitEditorCursor {

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


    _checkForSpace() {
        var occupied = false
        // check if place is occupied
        occupied |= Qubit.instances.some(qubit => qubit.position.equals(this.cursor.position))
        occupied |= InputBlock.positiveInstances.some(positiveInput => positiveInput.position.equals(this.cursor.position))
        occupied |= InputBlock.negativeInstances.some(negativeInput => negativeInput.position.equals(this.cursor.position))

        return occupied
    }


    _clickHandler() {
        if (this._checkForSpace()) return;
        try{
            switch (QubitEditorCursor.canEdit) {
                case QubitEditorCursor.canEditEnumeration.QUBIT:   
                    new Qubit(this.cursor.position)
                    break;
                
                case QubitEditorCursor.canEditEnumeration.NEGATIVE_INPUT:
                    new InputBlock(this.cursor.position, -1)
                    break;

                case QubitEditorCursor.canEditEnumeration.POSITIVE_INPUT:
                    new InputBlock(this.cursor.position, 1)
                    break;
            }
        } catch(exception) {
            console.info(exception)
        }    
    }


    _makeCursor() {
        // makes a box with parameters width, height, length
        let cursorgeometry = new THREE.BoxGeometry(QubitEditorCursor.SIZE, QubitEditorCursor.HEIGHT, QubitEditorCursor.SIZE)

        // makes a flat color material
        let cursormaterial = new THREE.LineBasicMaterial({
            color: QubitEditorCursor.COLOR
        })

        // Creates a contour of the box with the white material: that's our the cursor
        this.cursor = new THREE.LineSegments(new THREE.EdgesGeometry(cursorgeometry), cursormaterial)
        ThreeViewControllerInstance.addObjectToScene(this.cursor)
    }


    _makeGrid() {
        this.grid = new Grid(AssetManager.Get().fonts.optimer)
        ThreeViewControllerInstance.addObjectToScene(this.grid.object)
        ThreeViewControllerInstance.callbackOnRender(() => {
            this.grid.lookCamera(ThreeViewControllerInstance.camera.position)
        })
    }


    constructor() {
        document.addEventListener("mousemove", ev => this._mousemoveHandler(ev))
        document.addEventListener("mouseup", () => this._clickHandler())

        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()
        this.camera = ThreeViewControllerInstance.camera

        this._makeCursor()
        this._makeGrid()
    }
}

QubitEditorCursor.SIZE = 1
QubitEditorCursor.HEIGHT = 0.3
QubitEditorCursor.COLOR = 0x999999
QubitEditorCursor.canEditEnumeration = {
    NOTHING: 0,
    QUBIT: 1,
    POSITIVE_INPUT: 2, 
    NEGATIVE_INPUT: 3,
    OUTPUT: 4
}
QubitEditorCursor.canEdit = QubitEditorCursor.canEditEnumeration.NOTHING
