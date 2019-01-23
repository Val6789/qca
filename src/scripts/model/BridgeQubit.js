class BridgeQubit extends Qubit {
    constructor(steppingOver, polarity = 0, enableParticles = true, stepping = 1) {
        const position = steppingOver.add(new THREE.Vector3(0, stepping, 0))
        super(position, polarity, enableParticles)
        console.log(position, this)
    }
}