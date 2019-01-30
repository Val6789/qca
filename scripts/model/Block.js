/*
    exported 
    Block
*/

/**
 * @class Block
 * 
 * @brief Class reprensenting elements disposables on the world's grid
 * A box with a label on it.
 * Super-class of Qubit and InputBlock
 */
class Block {
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
        Block.instances.delete(this)
        AppControllerInstance.view.removeObjectFromScene(this.object) // will call a render
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

        var lineMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff
        })

        this.valueText = new THREE.Mesh(new THREE.TextGeometry(text, {
            font: AssetManager.Get().fonts.optimer,
            size: 0.25,
            height: 0,
            curveSegments: 4,
            bevelEnabled: false
        }), lineMaterial)
        this.valueText.name = "ValueText"
        if (this.type && this.type == "output") {
            this.valueText.geometry.scale(1.5, 1.5, 1.5)
            this.valueText.geometry.translate(-0.05, -0.1, 0)
        }
        this.valueText.geometry.translate(-0.1, -0.1, Block.QUBIT_THICK / 2 + 0.01) // center text on box (values adjusted for optimer font)
        this.valueText.geometry.rotateX(-Math.PI / 2)


        this.object.add(this.valueText)

        // calls render to show the new text
        AppControllerInstance.view.shouldRender()
    }

    setSublabel(text) {
        // because we can't update an existing TextGeometry's text, we need to delete and create it again
        this.object.remove(this.object.getObjectByName("SubLabel"))

        var lineMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff
        })

        this.valueText = new THREE.Mesh(new THREE.TextGeometry(text, {
            font: AssetManager.Get().fonts.optimer,
            size: 0.12,
            height: 0,
            curveSegments: 4,
            bevelEnabled: false
        }), lineMaterial)
        this.valueText.name = "SubLabel"
        this.valueText.geometry.translate(-0.35, 0.25, Block.QUBIT_THICK / 2 + 0.01) // adjust text on box (values adjusted for optimer font)
        this.valueText.geometry.rotateX(-Math.PI / 2)
    
        this.object.add(this.valueText)

        // calls render to show the new text
        AppControllerInstance.view.shouldRender()
    }

    setColor(color) {
        this.object.material.color = new THREE.Color(color)
    }

    toogleFixe() {
        this.fixed = !this.fixed;
    }

    _showFamilyColor(bool) {
        const color = bool ? Qubit.FAMILY_COLORS[this._clockId] : this.DEFAULT_COLOR
        this.family.material = Block._boxMaterial(color, this.family.material.opacity)
        AppControllerInstance.view.shouldRender()
    }

    resetPolarity() {
        return false
    }


    /**
     * @constructor Block
     * @param {THREE.Vector3} position
     * Creates object and add it to the scene
     */
    constructor(position) {
        // defines box properties
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            linewidth: Block.BORDER_WIDTH
        })
        const cubeGeometry = new THREE.BoxGeometry(Block.QUBIT_SIZE, Block.QUBIT_THICK, Block.QUBIT_SIZE)
        const edgesGeometry = new THREE.EdgesGeometry(cubeGeometry)

        this.DEFAULT_COLOR = "#000"

        this.fixed = false

        // makes sure the position is an integer
        position.round()

        // creates the box
        this.object = new THREE.LineSegments(edgesGeometry, lineMaterial)
        this.family = new THREE.Mesh(cubeGeometry, Block._boxMaterial())
        this.object.add(this.family)

        // moves the box
        this.object.position.copy(position)
        this.object.visible = Block._areVisible

        // adds box to position
        AppControllerInstance.view.addObjectToScene(this.object)
        Block.instances.add(this)
    }

    static _boxMaterial(color, opacity = Block.QUBIT_OPACITY) {
        return new THREE.MeshBasicMaterial({
            color: new THREE.Color(color),
            transparent: true,
            opacity: opacity,
            blendEquation: THREE.MultiplyBlending,
            depthTest: true,
            depthWrite: false,
            depthFunc: THREE.NeverDepth
        })
    }

    static get areVisible() {
        return Block._areVisible
    }

    static set areVisible(boolean) {
        if (Block._areVisible === boolean) return
        Block._areVisible = boolean
        if (Block.instances) Block.instances.forEach(block => block.object.visible = boolean)
        AppControllerInstance.view.shouldRender()
    }
}

/**
 * @static @constant
 * @brief Constants defining block dimentions.
 */
Block.QUBIT_SIZE = 0.8
Block.QUBIT_OPACITY = 0.4
Block.QUBIT_THICK = 0.3

Block.instances = new Set()
Block.BORDER_WIDTH = 2
