/* global THREE:true, Electron:true, AssetManager:true */
/* exported InfluenceOverlay */

class InfluenceOverlay {
    updateUniforms() {
        var self = this
        if (!self.shader) return

        var vertices = Electron.instances.map(electron => electron.position)
        self.slicePlane.geometry.vertices = vertices
        self.slicePlane.geometry.verticesNeedUpdate = true
    }

    constructor(threeController) {

        var self = this
        self.shader = new THREE.ShaderMaterial({
            vertexShader: AssetManager.Get().shaders["influences.vs.glsl"],
            fragmentShader: AssetManager.Get().shaders["influences.fs.glsl"],
            uniforms: {
                pointSize: {
                    value: Electron.INFLUENCE_SIZE
                }
            }
        })
        self.shader.transparent = true
        self.shader.opacity = 0.5
        self.shader.blending = THREE.AdditiveBlending
        self.shader.depthWrite = false
        self.shader.depthTest = true
        self.shader.depthFunc = THREE.NeverDepth
        self.dithering = true


        self.slicePlane = new THREE.Points(new THREE.Geometry(), self.shader)
        threeController.addObject(self.slicePlane)

        threeController.onRenderObservers.push(() => {
            self.updateUniforms()
        })
        self.threeController = threeController
    }
}
