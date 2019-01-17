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

class Qubit extends Block {
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
        this.setLabel(textValue)
    }


    remove() {
        super.remove()
        const removed = Qubit.instances.splice(Qubit.instances.indexOf(this), 1)[0]
        removed.dots.forEach(dot => dot.remove())
        removed.electrons.forEach(electron => electron.remove())
    }

    constructor(position = new THREE.Vector3()) {
        super(position) // haha

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
Qubit.instances = []
