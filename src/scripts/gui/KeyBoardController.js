/*
    global
    Preset
    AppController
*/


/**
 * @brief Keyboard controller
 *
 */

window.addEventListener("keyup", function (e) {
    const KEY_E = 69

    switch (e.keyCode) {
        case KEY_E:
            Preset.exportQuantomAutomata(new AppController().automata)
            break
    }
})