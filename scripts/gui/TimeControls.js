class TimeControls {

    _togglePauseIcon(paused) {
        var pauseIcon = document.getElementById("pause-button-icon")
        var playIcon = document.getElementById("play-button-icon")
        var boundingBox = document.getElementById("play-button").parentNode

        if (paused) {
            boundingBox.style.boxShadow = "0px 0px 10px 10px #ff0000"
            pauseIcon.style.display = "inline"
            playIcon.style.display = "none"
        } else {
            boundingBox.style.boxShadow = ""
            pauseIcon.style.display = "none"
            playIcon.style.display = "inline"
        }
    }


    _selectButton(id) {
        document.querySelectorAll(".time-control.active").forEach( button => {
            button.classList.remove("active")
        })
        document.getElementById(id).classList.add("active")
    }


    _clickHandler(event) {
        const button = event.currentTarget

        switch(button.id) {
            case "play-button":
            	UxSaverInstance.add("playClick")
                this.automataIsPaused = !this.automataIsPaused
                if (this.automataIsPaused) {
                    AppControllerInstance.refreshRate = AppController.PAUSED
                } else {
                    AppControllerInstance.refreshRate = AppController.SPEED
                }
                break

            case "slow-button":
            	UxSaverInstance.add("slowClick")
                AppControllerInstance.refreshRate = AppController.SPEED_SLOW
                this.automataIsPaused = false
                break

            case "fast-button":
            	UxSaverInstance.add("fastClick")
                AppControllerInstance.refreshRate = AppController.SPEED_FAST
                this.automataIsPaused = false
                break
        }
        this._selectButton(button.id)
        this._togglePauseIcon(this.automataIsPaused)
    }

    constructor() {
        for (let id of ["fast-button", "slow-button", "play-button"]) {
            document.getElementById(id).addEventListener("click", event => this._clickHandler(event))
        }
        this.automataIsPaused = false
    }
}