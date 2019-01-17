class Block {
    remove() {
        // will call render
        ThreeViewControllerInstance.removeObjectFromScene(this.object)
    }

    setLabel(text) {
        // because we can't update an existing TextGeometry's text, we need to delete and create it again
        this.object.remove(this.object.getObjectByName("ValueText"))

        const lineMaterial = new THREE.LineBasicMaterial({
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
        this.valueText.geometry.translate(-0.1, -0.1, Qubit.QUBIT_THICK / 2) // center text on box (values adjusted for optimer font)
        this.valueText.geometry.rotateX(-Math.PI / 2)
        this.object.add(this.valueText)
    }

    constructor(position) {
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff })
        const cubeGeometry = new THREE.BoxGeometry(Qubit.QUBIT_SIZE, Qubit.QUBIT_THICK, Qubit.QUBIT_SIZE)
        const edgesGeometry = new THREE.EdgesGeometry(cubeGeometry)

        // create object and move it
        this.object = new THREE.LineSegments(edgesGeometry, lineMaterial)
        this.object.translateX(position.x)
        this.object.translateZ(position.z)

        ThreeViewControllerInstance.addObjectToScene(this.object)
    }
}