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
        return this.dot.position
    }

    constructor(dot) {
        //properties 
        this.dot = dot
        this.charge = 1.0

        // insert new particle in the geometry attribute buffer
        let attributeBuffer = Electron._particuleGeometryBuffer.getAttribute("position")
        attributeBuffer.set(this.position.toArray(), Electron.instances.length * 3)
        attributeBuffer.needsUpdate = true

        // update buffer size
        Electron._particuleGeometryBuffer.setDrawRange(0, Electron.instances.length + 1)
        Electron._particuleGeometryBuffer.computeBoundingSphere()

        Electron.instances.push(this)
    }


    static _reloadParticuleGeometryBuffer() {
        // makes array of all the values of each position vector
        let positionArray = Electron.instances.reduce((buffer, electron) => buffer.concat(electron.position.toArray()), [])

        // overwrite the geometry buffer with new values
        let attributeBuffer = Electron._particuleGeometryBuffer.getAttribute("position")
        attributeBuffer.set(positionArray, 0)
        attributeBuffer.needsUpdate = true

        // update buffer size
        Electron._particuleGeometryBuffer.setDrawRange(0, Electron.instances.length)
        Electron._particuleGeometryBuffer.computeBoundingSphere()

        // turn off the calling flag
        Electron.bufferNeedsUpdate = false
    }

    static init() {
        // init the instances object
        Electron.instances = []

        // create the buffer for the geometry
        const MAX_POINTS = 1000

        // attributes buffer
        let positions = new Float32Array(MAX_POINTS * 3)
        let buffer = new THREE.BufferAttribute(positions, 3)

        // geometry buffer
        Electron._particuleGeometryBuffer = new THREE.BufferGeometry()
        Electron._particuleGeometryBuffer.dynamic = true
        Electron._particuleGeometryBuffer.addAttribute("position", buffer)

        // create particle system for each overlay
        Electron.overlays = {
            shapeOverlay: new THREE.Points(Electron._particuleGeometryBuffer, Electron._getSolidMaterial()),
            influenceOverlay: new THREE.Points(Electron._particuleGeometryBuffer, Electron._getInfluenceMaterial())
        }

        // add particle systems to the scene
        for (let name in Electron.overlays) {
            ThreeViewControllerInstance.addObjectToScene(Electron.overlays[name])
        }

        // add callback on render to check for updates
        ThreeViewControllerInstance.callbackOnRender(() => {
            if (Electron.bufferNeedsUpdate)
                Electron._reloadParticuleGeometryBuffer()
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