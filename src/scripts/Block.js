/**
 * @class Block
 * 
 * @brief Class reprensenting elements disposables on the world's grid
 * A box with a label on it.
 * Super-class of Qubit and InputBlock
 */
class Block {
    /**
     * @public @property @readonly
     * @brief Block position computed value
     */
    get position() {
        return this.object.position
    }


    /**
     * @public @method
     * @brief Removes the block from the scene
     */
    remove() {
        ThreeViewControllerInstance.removeObjectFromScene(this.object) // will call a render
    }
    
    /**
     * @public @method
     * @brief Sets the text on the label floating above the box
     * @param {String} text 
     * 
     * Expensive operation requiring destruction and reinstantiation of the label
     * Will ncall a render
     */
    setLabel(text) {
        // because we can't update an existing TextGeometry's text, we need to delete and create it again
        this.object.remove(this.object.getObjectByName("ValueText"))

        var lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff })
        lineMaterial.visible = document.getElementById("check-values").checked

        this.valueText = new THREE.Mesh(new THREE.TextGeometry(text, {
            font: AssetManager.Get().fonts.optimer,
            size: 0.25,
            height: 0,
            curveSegments: 4,
            bevelEnabled: false
        }), lineMaterial)
        this.valueText.name = "ValueText"
        this.valueText.geometry.translate(-0.1, -0.1, Block.QUBIT_THICK / 2) // center text on box (values adjusted for optimer font)
        this.valueText.geometry.rotateX(-Math.PI / 2)

        this.object.add(this.valueText)

        // calls render to show the new text
        ThreeViewControllerInstance.shouldRender()
    }

    setColor(color) {
        this.object.material.color = new THREE.Color(color)
    }


    /**
     * @constructor Block
     * @param {THREE.Vector3} position 
     * Creates object and add it to the scene
     */
    constructor(position) {
        // defines box properties
        var lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff })
        lineMaterial.visible = document.getElementById("check-outlines").checked
        
        const cubeGeometry = new THREE.BoxGeometry(Block.QUBIT_SIZE, Block.QUBIT_THICK, Block.QUBIT_SIZE)
        const edgesGeometry = new THREE.EdgesGeometry(cubeGeometry)

        // makes sure the position is an integer
        position.round()

        // creates the box
        this.object = new THREE.LineSegments(edgesGeometry, lineMaterial)

        // moves the box
        this.object.translateX(position.x)
        this.object.translateZ(position.z)

        // adds box to position
        ThreeViewControllerInstance.addObjectToScene(this.object)
    }
}

/**
 * @static @constant
 * @brief Constants defining block dimentions.
 */
Block.QUBIT_SIZE = 0.8
Block.QUBIT_THICK = 0.3
