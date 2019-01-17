/* 
    global 
    THREE
    Dot
    Electron
    AssetManager
*/
/* 
    exported 
    Qubit
*/

class Qubit {
    get position() {
        return this.object.position
    }

    get polarity() {
        // return value of qubit depending on electron position        
        if (this.electrons[0].dot === this.dots[0] && this.electrons[1].dot === this.dots[3])
            return 1
        if (this.electrons[0].dot === this.dots[1] && this.electrons[1].dot === this.dots[2])
            return 0
        return NaN
    }

    update() {
        let textValue = this.polarity != NaN ? this.polarity.toString() : "?"
        this.setText(textValue)
    }

    setText(text) {
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

    remove() {
        const removed = Qubit.instances.splice(Qubit.instances.indexOf(this), 1)[0]
        removed.dots.forEach(dot => dot.remove())
        removed.electrons.forEach(electron => electron.remove())
        ThreeViewControllerInstance.removeObjectFromScene(removed.object) // will call render
    }

    constructor(position = new THREE.Vector3()) {
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff
        })
        const cubeGeometry = new THREE.BoxGeometry(Qubit.QUBIT_SIZE, Qubit.QUBIT_THICK, Qubit.QUBIT_SIZE)
        const edgesGeometry = new THREE.EdgesGeometry(cubeGeometry)

        // create object and move it
        this.object = new THREE.LineSegments(edgesGeometry, lineMaterial)
        this.object.translateX(position.x)
        this.object.translateZ(position.z)

        // create dots
        var self = this
        this.dots = [
            new Dot(Qubit.DOT_DIST, Qubit.DOT_DIST, self),
            new Dot(-Qubit.DOT_DIST, Qubit.DOT_DIST, self),
            new Dot(Qubit.DOT_DIST, -Qubit.DOT_DIST, self),
            new Dot(-Qubit.DOT_DIST, -Qubit.DOT_DIST, self)
        ]

        // create electrons
        let dots = this.dots
        this.electrons = [
            new Electron(dots[1]),
            new Electron(dots[2])
        ]

        ThreeViewControllerInstance.addObjectToScene(this.object)
        // create value label
        this.update()

        Qubit.instances.push(this)
    }
}

Qubit.DOT_DIST = 0.2
Qubit.QUBIT_SIZE = 0.8
Qubit.QUBIT_THICK = 0.3
Qubit.instances = []