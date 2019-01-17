class Skybox {
    set style(skyboxStyle) {
        if (this._style === skyboxStyle) return

        
        this._style = skyboxStyle
        this.remove()

        const geometry = new THREE.BoxGeometry(Skybox.SIZE, Skybox.SIZE, Skybox.SIZE)
        var material

        switch(skyboxStyle) {
            case Skybox.styles.DEFAULT:
                material = Skybox._getSkyboxMaterial()
                break
            
            
            case Skybox.styles.LIGHT:
                material = Skybox._getSkyboxMaterial("_light")
                break
        
            default: throw console.error("Unkown skybox style")
        }

        this.object = new THREE.Mesh(geometry, material)
        ThreeViewControllerInstance.addObjectToScene(this.object)
    }


    remove() {
        ThreeViewControllerInstance.removeObjectFromScene(this.object)
    }

    constructor() {
        const material = Skybox._getSkyboxMaterial()
        
        this.style = Skybox.styles.DEFAULT;

        const geometry = new THREE.BoxGeometry(Skybox.SIZE, Skybox.SIZE, Skybox.SIZE)
        this.object = new THREE.Mesh(geometry, material)
        ThreeViewControllerInstance.addObjectToScene(this.object)
    }

    static _getSkyboxMaterial(specifier ="") {
        let reflectionCubeTexture = AssetManager.Get().textures["skybox" + specifier]
        reflectionCubeTexture.format = THREE.RGBFormat
        
        let shader = THREE.ShaderLib["cube"]
		shader.uniforms["tCube"].value = reflectionCubeTexture

		return new THREE.ShaderMaterial({
			fragmentShader: shader.fragmentShader,
			vertexShader: shader.vertexShader,
			uniforms: shader.uniforms,
			depthWrite: false,
			side: THREE.BackSide
        })
    }
}

Skybox.SIZE = 500
Skybox.styles = {
    DEFAULT: 0,
    LIGHT: 1
}