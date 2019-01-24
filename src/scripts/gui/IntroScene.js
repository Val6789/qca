/* 
    global 
    ThreeViewControllerInstance
    Electron
    ParticleSystem
    TweenLite
    TimelineLite
    ToolboxControllerInstance
*/
/* 
    exported 
    IntroScene
*/

class IntroScene {
    constructor(callbackDone) {
        this.callbackDone = callbackDone
        this._scene = new THREE.Scene()

        // Create the electron Particles system
        this._electrons = new ParticleSystem([Electron._getSolidMaterial(), Electron._getInfluenceMaterial()])
        this._scene.add(this._electrons._particlesGroup)

        // Create the dot
        this._dots = new ParticleSystem([Dot._getSolidMaterial()])
        this._scene.add(this._dots._particlesGroup)

        let light = new THREE.PointLight(0xffffff, 1, 100)
        light.position.set(-5, 0, 0)
        this._scene.add(light)
        this.TEXT_MATERIAL = new THREE.MeshLambertMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 1

        })
        this.TEXT_GEOMETRY_OPTIONS = {
            font: AssetManager.Get().fonts.optimer,
            size: 0.25,
            height: 0.1,
            curveSegments: 8,
            bevelEnabled: false
        }
        this.UPDATE_FUNCTION = () => {
            ThreeViewControllerInstance.shouldRender()
        }

    }

    /**
     * @brief called by the main instance to add the layer here
     * @param {*} layer 
     */
    setLayer(layer) {
        this.layer = layer
    }

    setCamera(camera) {
        this._camera = camera
    }

    async start() {
        this._setupScene()
        //await this._welcomeScene()
        this.doTutorial = await this._choiceScene()
        if (this.doTutorial) {
            //await this._electronScene()
            //await this._dotScene()
            //await this._qubitScene()
            //await this._outputScene()
            await this._inputScene()
        }
        this._deleteScene()
        this.callbackDone()
    }

    _setupScene() {

        // Update GUI
        ToolboxControllerInstance.hideUI()

        // Create the electron
        let pos = new THREE.Vector3(0, 0, 0)
        this._electrons.addAt(pos)
    }

    _welcomeScene() {
        const speed = 1
        return new Promise((resolve) => {
            // Camera movement
            let camPos = this._camera.position
            TweenLite.to(camPos, 4 / speed, {
                x: "+=4",
                onUpdate: this.UPDATE_FUNCTION,
                onComplete: resolve
            })

            // Timeline
            let timeline = new TimelineLite()
            this.timeline = timeline
            timeline.timeScale(speed)
            const rotation = new THREE.Vector3(-4, 0, 0)
            const TIMER_SPACE = 0.2 / speed
            let timing = 0.6
            let texts = []
            this.texts = texts
            const lineDisplay = (startY, startZ, line) => {
                line = line.split(" ")
                let y = startY
                let z = startZ
                for (let i = 0; i < line.length; i++) {
                    let word = line[i]
                    let txt = this._createTextMesh(word, 0, y, z, rotation)
                    timeline.fromTo(txt.position, 1, txt.from, txt.to, timing)
                    texts.push(txt)
                    z += txt.length / 2 + 0.1
                    timing += TIMER_SPACE
                }
            }

            // Fist two lines
            lineDisplay(1.4, -0.35, "Hello")
            lineDisplay(0.9, -0.85, "Welcome to")
            lineDisplay(0.4, -1.15, "QCA Simulator")
            timeline.to({}, 0, {
                onComplete: () => {
                    resolve()
                }
            }, 1.5)

        })
    }

    _choiceScene() {
        return new Promise(async (resolve) => {
            ToolboxControllerInstance.revealChoice()
            let choice = await ToolboxControllerInstance.choiceClick()

            // Hide
            ToolboxControllerInstance.hideChoice()

            let texts = this.texts
            if (texts) {
                TweenLite.to(texts[0].material, 0.4, {
                    opacity: 0,
                    onUpdate: this.UPDATE_FUNCTION,
                    onComplete: () => {
                        for (let i = 0; i < texts.length; i++) {
                            this._scene.remove(texts[i])
                        }
                        delete this.texts
                    }
                })
            }

            if (choice === "tutorial") {
                resolve(true)
            } else if (choice === "sandbox") {
                resolve(false)
            }
        })
    }

    _electronScene() {
        return new Promise(async (resolve) => {

            // UI
            ToolboxControllerInstance.revealInfoHolder()
            ToolboxControllerInstance.setInfoHolderTitle("Electron")
            const json = AssetManager.Get().json.electronIntro

            // Text
            await this._displayJSON(json)

            // Clear
            this._electrons.clean()
            resolve()
        })

    }

    _dotScene() {
        return new Promise(async (resolve) => {
            // Creation
            ToolboxControllerInstance.hideInfoHolder()
            let pos = new THREE.Vector3(0, 0, 0)
            this._dots.addAt(pos)
            let camPos = this._camera.position
            await new Promise(littleResolve => {
                TweenLite.to(camPos, 2, {
                    x: "+=2",
                    onUpdate: this.UPDATE_FUNCTION,
                    onComplete: littleResolve
                })
            })
            ToolboxControllerInstance.setInfoHolderTitle("Dot")
            ToolboxControllerInstance.revealInfoHolder()

            // Text
            const json = AssetManager.Get().json.dotIntro
            await this._displayJSON(json)

            // Add an electron
            this._electrons.addAt(pos)
            await new Promise(littleResolve => {
                TweenLite.to(camPos, 0.2, {
                    x: "-=1",
                    onUpdate: this.UPDATE_FUNCTION,
                    onComplete: littleResolve
                })
            })

            // Second text
            const json2 = AssetManager.Get().json.dotIntro2
            await this._displayJSON(json2)

            // Clean and resolve
            this._electrons.clean()
            this._dots.clean()
            this.UPDATE_FUNCTION()
            resolve()

        })
    }

    _qubitScene() {
        return new Promise(async (resolve) => {
            // Clean
            this._electrons.clean()
            this._dots.clean()

            // Text
            ToolboxControllerInstance.setInfoHolderTitle("Qubit")
            ToolboxControllerInstance.revealInfoHolder()
            const json = AssetManager.Get().json.qubitIntro
            await this._displayJSON(json)

            // Creation
            ToolboxControllerInstance.hideInfoHolder()
            let pos = new THREE.Vector3(0, 0, 0)
            let qubit = new Qubit()
            let camPos = this._camera.position
            await new Promise(littleResolve => {
                TweenLite.to(camPos, 2, {
                    x: 0,
                    y: 4,
                    z: 6,
                    onUpdate: () => {
                        this._camera.lookAt(pos)
                        this.UPDATE_FUNCTION()
                    },
                    onComplete: littleResolve
                })
            })
            ToolboxControllerInstance.revealInfoHolder()

            // Text 2            
            const json2 = AssetManager.Get().json.qubitIntro2
            await this._displayJSON(json2)

            // Display the 1
            qubit.polarity = 1
            this.UPDATE_FUNCTION()
            ToolboxControllerInstance.setInfoHolderTitle("State 1")
            await this._paragraphCallBack()


            // Display the 0
            qubit.polarity = -1
            this.UPDATE_FUNCTION()
            ToolboxControllerInstance.setInfoHolderTitle("State 0")
            await this._paragraphCallBack()

            // Basic
            qubit.polarity = 0
            this.UPDATE_FUNCTION()


            // Text 3
            ToolboxControllerInstance.setInfoHolderTitle("Qubit")
            const json3 = AssetManager.Get().json.qubitIntro3
            await this._displayJSON(json3)


            // Clean and resolve
            ToolboxControllerInstance.hideInfoHolder()
            qubit.remove()
            resolve()
        })
    }

    _outputScene() {
        return new Promise(async (resolve) => {
            // Clean
            this._electrons.clean()
            this._dots.clean()

            // Creation
            ToolboxControllerInstance.hideInfoHolder()
            let pos = new THREE.Vector3(0, 0, 0)
            let output = new OutputBlock(pos)
            let camPos = this._camera.position
            await new Promise(littleResolve => {
                TweenLite.to(camPos, 1, {
                    x: 0,
                    y: 4,
                    z: 3,
                    onUpdate: () => {
                        this._camera.lookAt(pos)
                        this.UPDATE_FUNCTION()
                    },
                    onComplete: littleResolve
                })
            })

            // Timeline
            let timeline = new TimelineLite({
                onComplete: () => {
                    timeline.restart()
                }
            })
            timeline.to(output, 1, {
                polarity: 1,
                ease: SteppedEase.config(1),
                onUpdate: this.UPDATE_FUNCTION
            })
            timeline.to(output, 1, {
                polarity: 0,
                ease: SteppedEase.config(1),
                onUpdate: this.UPDATE_FUNCTION
            })
            timeline.to(output, 1, {
                polarity: -1,
                ease: SteppedEase.config(1),
                onUpdate: this.UPDATE_FUNCTION
            })
            timeline.to(output, 1, {
                polarity: 0,
                ease: SteppedEase.config(1),
                onUpdate: this.UPDATE_FUNCTION
            })


            // Text
            ToolboxControllerInstance.setInfoHolderTitle("Output Block")
            ToolboxControllerInstance.revealInfoHolder()
            const json = AssetManager.Get().json.outputIntro
            await this._displayJSON(json)


            // Clean and resolve
            output.remove()
            resolve()
        })
    }

    _inputScene() {
        return new Promise(async (resolve) => {

            // Creation
            ToolboxControllerInstance.hideInfoHolder()
            let pos = new THREE.Vector3(0, 0, 0)
            let inputPositive = new InputBlock(pos, 1)
            let inputNegative = new InputBlock(pos, -1)
            inputNegative.object.visible = false

            // Timeline
            let interval = setInterval(() => {
                inputNegative.object.visible = !inputNegative.object.visible
                inputPositive.object.visible = !inputPositive.object.visible
                this.UPDATE_FUNCTION()
            }, 1500)


            // Text
            ToolboxControllerInstance.setInfoHolderTitle("Influencer")
            ToolboxControllerInstance.revealInfoHolder()
            const json = AssetManager.Get().json.inputIntro
            await this._displayJSON(json)


            // Clean and resolve
            clearInterval(interval)
            inputPositive.remove()
            inputNegative.remove()
            resolve()
        })


    }

    _deleteScene() {
        ToolboxControllerInstance.revealUI()
        ToolboxControllerInstance.hideInfoHolder()
        Utils.doDispose(this._scene)
        this._electrons._destructor()

        if (this.doTutorial) {
            AchievementManager.Get().obtained("tutorial")
        }
    }

    _createTextMesh(text, x, y, z) {
        let geo = new THREE.TextGeometry(text, this.TEXT_GEOMETRY_OPTIONS)
        let mesh = new THREE.Mesh(geo, this.TEXT_MATERIAL)
        var box = new THREE.Box3().setFromObject(mesh)
        mesh.from = {
            x,
            y: y - 2,
            z
        }
        mesh.to = {
            x,
            y,
            z,
            onStart: () => {
                this._scene.add(mesh)
            },
            onUpdate: () => {
                this.UPDATE_FUNCTION()
                mesh.rotation.set(0, THREE.Math.degToRad(-90), 0)
            }
        }
        mesh.length = box.max.length() * 2
        return mesh
    }

    _lineCallback(endline, timeout) {
        if (timeout)
            clearTimeout(timeout)
        if (endline)
            endline()
    }

    _paragraphCallBack() {
        return new Promise(resolve => {
            ToolboxControllerInstance.setInfoHolderNextClickCallback(() => {
                resolve()
            })
        })

    }

    async _displayJSON(json) {
        if (!json)
            throw Error("No json:" + json)

        // Variables
        let lineLatency = 1000,
            timeout, endline

        // Add line
        const addLine = (text) => {
            return new Promise(littleResolve => {
                endline = () => {
                    ToolboxControllerInstance.addInfoHolderText(text)
                    // Letter per second
                    const avgReadingSpeed = 25.25
                    lineLatency = avgReadingSpeed * text.length
                    timeout = null
                    endline = null
                    littleResolve()
                }
                timeout = setTimeout(endline, lineLatency)
            })
        }

        for (let i = 0; i < json.length; i++) {
            const paragraph = json[i]

            // Force the next line
            ToolboxControllerInstance.setInfoHolderNextClickCallback(() => {
                this._lineCallback(endline, timeout)
            })

            // Await for the line latency to be completed
            for (let j = 0; j < paragraph.length; j++) {
                const line = paragraph[j]
                await addLine(line)
            }

            // Paragraph finished
            await this._paragraphCallBack()
            ToolboxControllerInstance.clearInfoHolder()
            lineLatency = 0
        }
    }
}
