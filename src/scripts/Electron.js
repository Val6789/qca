/* global THREE:true, AssetManager:true */
/* exported Electron */

class Electron {
    get position() {
        return this.dot.position
    }

    constructor(dot) {
        //properties 
        this.dot = dot
        this.charge = 1.0

        Electron.particles.addAt(this.position)
        Electron.instances.push(this)
    }

    static init() {
        // init the instances object
        Electron.instances = []
        Electron.particles = new ParticleSystem([this._getSolidMaterial(), this._getInfluenceMaterial()])

        // add callback on render to check for updates
        ThreeViewControllerInstance.callbackOnRender(() => {
            if (Electron.bufferNeedsUpdate)
                Electron.particles.reloadParticules(Electron.instances.map(electron => electron.position))
        })
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
            transparent : true,
            opacity : 0.5,
            blending : THREE.AdditiveBlending,
            depthWrite : false,
            depthTest : true,
            depthFunc : THREE.NeverDepth
        })
    }


    static _getSolidMaterial() {
        return new THREE.PointsMaterial({
            size: 0.5,
            sizeAttenuation: true,
            map: AssetManager.Get().textures.electron,
            transparent: false,
            alphaTest: 0.1
        })
    }

}

Electron.RADIUS = 0.8
Electron.INFLUENCE_SIZE = 2000.0
Electron.INFLUENCE_COLOR = 0x00ff00
Electron.bufferNeedsUpdate = false
