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
    const KEY_U = 85
    const KEY_Z = 90
    const KEY_Y = 89

    switch (e.keyCode) {
        case KEY_E:
            Preset.exportQuantomAutomata(new AppController().automata)
            break
        case KEY_U:
            UxSaverInstance.export()
            break
        case KEY_Z:
            History.undo()
            UIControllerInstance._updateHistoryButtons()
            break;
        case KEY_Y:
            History.redo()
            UIControllerInstance._updateHistoryButtons()
            break;
    }
})