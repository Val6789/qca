class Cursor {

    /**
     * @brief Cursor position getter, returns the cursor position in 3D space based on the THREE object's position
     */
    get position() {
        if (this._selectionBox.visible)
            return this._selectionBox.position
        return false
    }

    get isVisible() {
        return this._selectionBox.visible
    }

    /**
     * @brief Updates the cursort position and calls render on change
     * @param {Number} screenX pixel coordinates of the user pointing device
     * @param {Number} screenY pixel coordinates of the user pointing device
     * @param {Number} wheelDelta value representing the mouse wheel movement
     */
    update(screenX = null, screenY = null, wheelDelta = 0) {
        // save previous cursor state
        const wasVisible = this._selectionBox.visible
        const previousPosition = this._selectionBox.position.clone()

        // get the new wanted position
        var newPosition = this._castRayFromMousePosition(screenX, screenY)
        // set the cursor to visible if the new position exists
        this._selectionBox.visible = newPosition != false

        if (newPosition) {
            // replace the height value with the current heigth value offseted by the wheelDelta
            newPosition.y = previousPosition.y + Math.sign(wheelDelta)

            // if on magnetic mode, replace the new position with the closest block position
            if (this.isMagnetic && wheelDelta == 0) {
                var closestBlockPosition = AppControllerInstance.automata.getOccupiedPositions().reduce((best, current) => {
                    if (!best) return current
                    if (newPosition.distanceToSquared(best) > newPosition.distanceToSquared(current)) return current
                    return best
                }, false)
                newPosition = closestBlockPosition || newPosition
            }

            newPosition.round()
        }

        // if the cursor changed, call for a render
        if (this._selectionBox.visible == wasVisible && newPosition.equals(previousPosition)) return false

        this._selectionBox.position.copy(newPosition)
        this._updateDepthColumn()

        this._cursorMoveCallbacks.forEach( callback => callback(newPosition))
        ThreeViewControllerInstance.shouldRender()
        return true
    }

    /**
     * add a listener to the movements of the cursor
     * @param {Function} callback
     */
    callbackOnMove(callback) {
        this._cursorMoveCallbacks.push(callback)
    }

    /**
     * @brief convert mouse position into a position in the 3D scene
     * by raycasting from the camera to the grid, through the cursor
     * @param {Number} x pixel cursor position
     * @param {Number} y pixel cursor position
     */
    _castRayFromMousePosition(x,y) {
        if (!this.grid) return false

        // get mouse position as a floating point value between -1 and 1
        var pointer
        if (x && y)
            pointer = new THREE.Vector2(
                (x / window.innerWidth) * 2 - 1,
                -(y / window.innerHeight) * 2 + 1
            );
        else
            pointer = new THREE.Vector2(0,0)

        // cast ray from the camera, through the cursor
        this._raycaster.setFromCamera(pointer, ThreeViewControllerInstance.camera)

        // collect detected intersections
        let intersection = this._raycaster.intersectObject(this.grid.hitzone)

        return intersection[0] ? intersection[0].point : false
    }

    /**
     * @brief Draws a box from the grid to the cursor, to help the user see at which height he's drawing
     */
    _updateDepthColumn() {
        // clamp box height to the max stacking value
        this._selectionBox.position.y = Math.max(-this.MAX_STACKING, Math.min(this._selectionBox.position.y, this.MAX_STACKING))

        this._depthColumn.position.copy(this._selectionBox.position)
        this._depthColumn.scale.y = Math.ceil(this._selectionBox.position.y - this.HEIGHT / 2)
        this._depthColumn.position.y = (this._selectionBox.position.y) / 2 - this.HEIGHT / 2
        this._depthColumn.visible = this._depthColumn.scale.y != 0
    }

    _lineMaterial() {
        return new THREE.LineBasicMaterial({
            color: this.COLOR,
            opacity: this.ALPHA,
            transparent: this.ALPHA < 1
        })
    }

    // grid constructor
    _makeGrid() {
        this.grid = new Grid(AssetManager.Get().fonts.optimer, -this.HEIGHT / 2)
        ThreeViewControllerInstance.addObjectToScene(this.grid.object)
    }

    // depth column constructor
    _makeDepthColumn() {
        let yColumnGeometry = new THREE.BoxGeometry(this.SIZE, this.SIZE, this.SIZE)
        let cursormaterial = this._lineMaterial()
        this._depthColumn = new THREE.LineSegments(new THREE.EdgesGeometry(yColumnGeometry), cursormaterial)
        ThreeViewControllerInstance.addObjectToScene(this._depthColumn)
    }

    // selection Box constructor
    _makeSelectionBox() {   // makes a box with parameters width, height, length
        let cursorgeometry = new THREE.BoxGeometry(this.SIZE, this.HEIGHT, this.SIZE)
        let cursormaterial = this._lineMaterial()
        this._selectionBox = new THREE.LineSegments(new THREE.EdgesGeometry(cursorgeometry), cursormaterial)
        ThreeViewControllerInstance.addObjectToScene(this._selectionBox)
    }

    constructor(color = 0x999999, alpha = 1) {
        this.SIZE = 1
        this.HEIGHT = 0.3
        this.COLOR = color
        this.ALPHA = alpha
        this.MAX_STACKING = 10

        this._raycaster = new THREE.Raycaster()
        this._cursorMoveCallbacks = new Array()
        this.isMagnetic = false

        this._makeSelectionBox()
        this._makeDepthColumn()
        this._makeGrid()
        this.update()
    }
}




