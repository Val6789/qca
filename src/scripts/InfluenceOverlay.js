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

        var vertexShaderRequest = fetch("./assets/shaders/influences.vs.glsl", {method: "GET"})
        var fragmentShaderRequest = fetch("./assets/shaders/influences.fs.glsl", {method: "GET"})
        
        Promise.all([vertexShaderRequest, fragmentShaderRequest]).then(responses => {
            Promise.all(responses.map( response => response.text())).then(sourceCode => {
                
                self.shader = new THREE.ShaderMaterial({
                    vertexShader: sourceCode[0],
                    fragmentShader: sourceCode[1],
                    uniforms: {
                        pointSize: {value: Electron.INFLUENCE_SIZE}
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
            })
        })

        threeController.onRenderObservers.push(() => {self.updateUniforms()})
        self.threeController = threeController
    }
}