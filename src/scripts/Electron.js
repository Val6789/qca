/* global THREE:true, AssetManager:true */
/* exported Electron */

class Electron {
    get position() {
        return this.dot.position
    }

    static init() {
        // init the instances object
        Electron.instances = []

        // create the buffer for the geometry
        const MAX_POINTS = 1000

        // geometry
        Electron.geometry = new THREE.BufferGeometry()
        Electron.geometry.dynamic = true

        // attributes
        let positions = new Float32Array(MAX_POINTS * 3)
        let buffer = new THREE.BufferAttribute(positions, 3)
        Electron.geometry.addAttribute("position", buffer)

        // load and setup the sprite
        const electronImage = AssetManager.Get().textures.electron

        const shapeMaterial = new THREE.PointsMaterial({
            size: 0.5,
            sizeAttenuation: true,
            map: electronImage,
            transparent: false,
            alphaTest: 0.1
        })

        const influenceMaterial = new THREE.ShaderMaterial({
            vertexShader: AssetManager.Get().shaders["influences.vs.glsl"],
            fragmentShader: AssetManager.Get().shaders["influences.fs.glsl"],
            uniforms: {
                pointSize: {
                    value: Electron.INFLUENCE_SIZE
                }
            },
            transparent : true,
            opacity : 0.5,
            blending : THREE.AdditiveBlending,
            depthWrite : false,
            depthTest : true,
            depthFunc : THREE.NeverDepth
        })

        Electron.overlays = {
            shapeOverlay: new THREE.Points(Electron.geometry, shapeMaterial),
            influenceOverlay: new THREE.Points(Electron.geometry, influenceMaterial)
        }
        
        for (name in Electron.overlays) {
            ThreeViewControllerInstance.addObjectToScene(Electron.overlays[name])
        }
    }

    static recreate() {
        Electron.instances.forEach((electron, bufferindex) => {
            const position = electron.position
            positions[bufferindex * 3 + 0] = position.x
            positions[bufferindex * 3 + 1] = position.y
            positions[bufferindex * 3 + 2] = position.z
        })

        Electron.geometry.setDrawRange(0, Electron.instances.length)
        Electron.geometry.attributes.position.needsUpdate = true
        Electron.geometry.computeBoundingSphere()

        Electron.needsUpdate = false
    }

    constructor(dot) {
        this.dot = dot
        this.charge = 1.0

        const x = dot.position.x
        const y = dot.position.y
        const z = dot.position.z
        var positions = Electron.geometry.attributes.position.array
        let i = Electron.instances.length * 3
        positions[i + 0] = x
        positions[i + 1] = y
        positions[i + 2] = z
        Electron.geometry.setDrawRange(0, i + 1)
        Electron.geometry.attributes.position.needsUpdate = true
        Electron.geometry.computeBoundingSphere()

        Electron.instances.push(this)
        Electron.needsUpdate = true
    }
}

Electron.RADIUS = 0.8
Electron.INFLUENCE_SIZE = 2000.0
Electron.needsUpdate = false
