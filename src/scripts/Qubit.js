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
        if (!this.isDetermined) return NaN
        // return value of qubit depending on electron position        
        if (this.electrons[0].dot === this.dots[0] && this.electrons[1].dot === this.dots[3])
            return 1
        if (this.electrons[0].dot === this.dots[1] && this.electrons[1].dot === this.dots[2])
            return 0

        throw console.error("marked as determined but with no polarisation.")
    }

    set polarity(newValue) {
        if (newValue == this.polarity) return

        var label
        switch (newValue) {
            case 1: case true:
                this.electrons[0].dot = this.dots[0]
                this.electrons[1].dot = this.dots[3]
                this.isDetermined = true
                label = "1"
                break;

            case 0: case false:
                this.electrons[0].dot = this.dots[1]
                this.electrons[1].dot = this.dots[2]
                this.isDetermined = true
                label = "0"
                break;
            
            default:
                this.isDetermined = false
                label = "?"
        }

        this.setLabel(label)
    }

    _showUndetermination() {
        if (this.isDetermined) return
        this.electrons.forEach( electron => {
            const randomIndex = Math.floor(Math.random() * this.dots.length)
            electron.dot = this.dots[randomIndex]
        })
    }

    remove() {
        super.remove()
        const removed = Qubit.instances.splice(Qubit.instances.indexOf(this), 1)[0]
        removed.dots.forEach(dot => dot.remove())
        removed.electrons.forEach(electron => electron.remove())
    }

    constructor(position = new THREE.Vector3(), polarity = NaN) {
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

        this.polarity = polarity

        ThreeViewControllerInstance.addObjectToScene(this.object)
        Qubit.instances.push(this)
    }

    static startDeterminationUpdateLoop() {
        setInterval(() => {
            Qubit.instances.forEach(qubit => { 
                qubit._showUndetermination() 
            })
        }, Qubit.UNDETERMINED_REFRESH_RATE)        
    }
}

Qubit.UNDETERMINED_REFRESH_RATE = 300 // seconds
Qubit.DOT_DIST = 0.2
Qubit.instances = []
