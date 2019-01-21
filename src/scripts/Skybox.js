class Skybox {
    
    setStyle(style) {
        this.style = style
    }
    
    get scene() {
        if (this.style == Skybox.styles.DARK)
            return this.sceneDark
        else
            return this.sceneLight
    }
    
    constructor() {
        
        // Scene and camera
        this.sceneLight = new THREE.Scene()
        this.sceneLight.name = "Scene Light"
        this.sceneDark = new THREE.Scene()
        this.sceneLight.name = "Scene Dark"
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000)

        // Materials
        this.materialDark = Skybox._getSkyboxMaterial("Dark")
        this.materialLight = Skybox._getSkyboxMaterial("Light")

        // Geometry
        this.geometry = new THREE.BoxGeometry(Skybox.SIZE, Skybox.SIZE, Skybox.SIZE)
        
        // Light and dark
        this.meshDark = new THREE.Mesh(this.geometry, this.materialDark)
        this.meshLight = new THREE.Mesh(this.geometry, this.materialLight)
        
        // Settings
        this.style = Skybox.styles.DEFAULT
        this.name = "Skybox"
        
        // Add to scenes
        this.sceneDark.add(this.meshDark)
        this.sceneLight.add(this.meshLight)
    }

    static _getSkyboxMaterial(specifier) {
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

Skybox.SIZE = 100
Skybox.styles = {
    DARK: 0,
    DEFAULT: 0,
    LIGHT: 1
}
