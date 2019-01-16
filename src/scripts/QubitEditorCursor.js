/* global THREE:true, Qubit:true, Grid:true */
/* exported QubitEditorCursor */

class QubitEditorCursor {

    mousemoveHandler(event) {
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


    clickHandler() {
        if (QubitEditorCursor.canEdit) {
            let newQubit = new Qubit(this.cursor.position)
            if (newQubit) {
                ThreeViewControllerInstance.addObjectToScene(newQubit.object)
                console.log("new qubit at", this.cursor.position)
            } else {
                console.log("there's already a qubit here!")
            }
        }
    }


    makeCursor() {
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


    makeGrid() {
        threeViewController.getFont().then((font) => {
            this.grid = new Grid(font)
            ThreeViewControllerInstance.addObjectToScene(this.grid.object)
            ThreeViewControllerInstance.callbackOnRender(() => {
                this.grid.lookCamera(ThreeViewControllerInstance.camera.position)
            })
        })
    }

    constructor() {
        document.addEventListener("mousemove", ev => this.mousemoveHandler(ev))
        document.addEventListener("mouseup", () => this.clickHandler())

        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()
        this.camera = ThreeViewControllerInstance.camera

        this.makeCursor()
        this.makeGrid()
    }
}

QubitEditorCursor.SIZE = 1
QubitEditorCursor.HEIGHT = 0.3
QubitEditorCursor.COLOR = 0x999999
QubitEditorCursor.canEdit = false
