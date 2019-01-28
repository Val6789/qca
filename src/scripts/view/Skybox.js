/* 
    global 
    AppControllerInstance
*/

class Skybox {

    setStyle(style) {
        if (this.style != style) {
            this.style = style
            AppControllerInstance.view.shouldRender()
            if (style == Skybox.styles.DARK)
                this.material = Skybox._getSkyboxMaterial("Dark")
            else
                this.material = Skybox._getSkyboxMaterial("Light")
        }
    }

    constructor() {

        // Scene and camera
        this.scene = new THREE.Scene()

        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000)

        // Materials
        this.material = Skybox._getSkyboxMaterial("Dark")

        // Geometry
        this.geometry = new THREE.BoxGeometry(Skybox.SIZE, Skybox.SIZE, Skybox.SIZE)

        // Light and dark
        this.mesh = new THREE.Mesh(this.geometry, this.material)

        // Settings
        this.style = Skybox.styles.DEFAULT
        this.name = "Skybox"

        // Add to scenes
        this.scene.add(this.mesh)
        console.log(AppControllerInstance.view)
        AppControllerInstance.view.callbackOnRender(() => {
            let q = AppControllerInstance.view.camera.quaternion
            this.camera.quaternion.set(q.x, q.y, q.z, q.w)
        })
    }

    static _getSkyboxMaterial(specifier) {

        let path = "skybox" + specifier
        let reflectionCubeTexture = AssetManager.Get().textures[path]
        reflectionCubeTexture.format = THREE.RGBFormat

        const shader = Object.assign({}, THREE.ShaderLib["cube"])
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
