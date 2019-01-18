/* 
    global
    THREE, 
    AssetManager,
    ThreeViewControllerInstance
*/
/* 
    exported 
    Electron
*/

class Electron {
    get position() {
        return this._dot.position
    }

    get dot() {
        return this._dot
    }

    set dot(newDot) {
        this._dot = newDot
        Electron._updateParticles()
    }
    
    remove() {
        Electron.instances.splice(Electron.instances.indexOf(this), 1)
        Electron._updateParticles()
    }

    constructor(dot) {
        //properties 
        this._dot = dot
        this.charge = 1.0

        Electron.particles.addAt(this.position)
        Electron.instances.push(this)
    }

    static init() {
        // init the instances object
        Electron.instances = []
        Electron.particles = new ParticleSystem([this._getSolidMaterial(), this._getInfluenceMaterial()])
    }

    static _updateParticles() {
        Electron.particles.positions = Electron.instances.map(electron => electron.position)
        ThreeViewControllerInstance.shouldRender()
    }

    static _getInfluenceMaterial() {
        return new THREE.ShaderMaterial({
            vertexShader: AssetManager.Get().shaders["influences.vs.glsl"],
            fragmentShader: AssetManager.Get().shaders["influences.fs.glsl"],
            uniforms: {
                pointSize: {
                    value: Electron.INFLUENCE_SIZE
                },
                color: {
                    value: new THREE.Color(Electron.INFLUENCE_COLOR)
                },
                opacity: {
                    value: 0.5
                }
            },
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            depthTest: true,
            depthFunc: THREE.NeverDepth
        })
    }


    static _getSolidMaterial() {
        return new THREE.PointsMaterial({
            size: Electron.RADIUS,
            sizeAttenuation: true,
            map: AssetManager.Get().textures.electron,
            transparent: false,
            alphaTest: 0.1
        })
    }

}

Electron.RADIUS = 0.3
Electron.INFLUENCE_SIZE = 2000.0
Electron.INFLUENCE_COLOR = 0x00ff00
Electron.bufferNeedsUpdate = false