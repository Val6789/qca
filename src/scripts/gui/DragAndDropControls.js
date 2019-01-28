/**
 * @class Drag and Drop Controls
 * @brief Creates drag and drop interactions for touch and mouse
 */
class DragAndDropControls {

    /**
     * @public @method
     * @brief callback called at the begining of the drag, takes the target dom element and returns the payload
     * @param {(domElement) => payload} callback handles the begining of the drag
     * @returns payload
     */
    onDragCallback(callback) {
        this.onDrag = callback
    }


    /**
     * @public @method
     * @brief callback called on drop, with payload passed in parameter
     * @param {(payload) => void} callback handling the dropped payload
     */
    onDropCallback(callback) {
        this.onDrop = callback
    }

    onCancelCallback(callback) {
        this.onCancel = callback
    }


    /**
     * @private @method
     * @brief touch start handler, clones the target element to make it float around, under the finger
     * @param {Event} event 
     */
    _initiateDrag(event) {
        AppControllerInstance.view.orbitControls.enableRotate = false
        AppControllerInstance.view.orbitControls.enablePan = false
        if (this._currentDragPlayload) document.body.removeChild(this._currentDragPlayload.domElement)

        var item = this.onDrag(event.currentTarget)

        this._currentDragPlayload = {
            item: item,
            domElement: document.body.appendChild(event.currentTarget.cloneNode(true))
        }

        if (event instanceof TouchEvent)
            this._currentDragPlayload.startPosition = event.touches.item(0)
        else
            this._currentDragPlayload.startPosition = event

        this._updateDrag(event)
    }

    /**
     * @private @method
     * @brief updates the floating element to keep it under the finger/cursor
     * @param {MouseEvent, TouchEvent} event
     */
    _updateDrag(event) {
        var pointer
        if (event instanceof TouchEvent)
            pointer = event.touches.item(0)
        else
            pointer = event

        EditorInstance.cursor.update(pointer.clientX, pointer.clientY)
        if (this._currentDragPlayload) {
            // set validity flag to false if the finger has not left the button bounds
            const elementRadius = Math.hypot(
                this._currentDragPlayload.domElement.clientWidth,
                this._currentDragPlayload.domElement.clientHeight)
            const movementDistance = Math.hypot(
                this._currentDragPlayload.startPosition.clientX - pointer.clientX,
                this._currentDragPlayload.startPosition.clientY - pointer.clientY)

            this._currentDragPlayload.isValidDrag = elementRadius * 0.8 < movementDistance

            this._currentDragPlayload.domElement.style.cssText = `
            position: fixed;
            z-index: 100000;
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.9;
            border: solid 3px yellow;
            left: ${pointer.clientX}px;
            top: ${pointer.clientY}px;`
        }
    }


    /**
     * @private @method
     * @brief destroys the floating element and calls the drop callback. then destroys the payload
     */
    _executeDrop() {
        AppControllerInstance.view.orbitControls.enableRotate = true
        AppControllerInstance.view.orbitControls.enablePan = true
        if (this._currentDragPlayload) {
            if (this._currentDragPlayload.isValidDrag) {
                if (this.onDrop) this.onDrop(this._currentDragPlayload.item)
            } else {
                if (this.onCancel) this.onCancel(this._currentDragPlayload.item)
            }
            document.body.removeChild(this._currentDragPlayload.domElement)
        }
        this._currentDragPlayload = null;
    }


    /**
     * @constructor
     * @brief sets event listeners
     * @param {String} cssClassSelector css Selector pointing to all draggables 
     * @param {Boolean} mouse enables mouse drags
     */
    constructor(cssClassSelector, mouse = true) {
        const tools = document.querySelectorAll(cssClassSelector)

        tools.forEach(tool => {
            tool.addEventListener("touchstart", event => this._initiateDrag(event))
            tool.addEventListener("touchmove", event => this._updateDrag(event))
            tool.addEventListener("touchend", event => this._executeDrop(event))

            if (mouse) {
                tool.addEventListener("mousedown", event => this._initiateDrag(event))
                document.addEventListener("mousemove", event => this._updateDrag(event))
                document.addEventListener("mouseup", event => this._executeDrop(event))
            }
        })

        /**
         * @private @member
         * @brief Holds data about the current drag, such as:
         * - floating Dom element
         * - the payload
         */
        this._currentDragPlayload = undefined
    }
}
