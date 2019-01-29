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
    const KEY_F = 70
    const KEY_P = 80
    const KEY_U = 85
    const KEY_W = 87
    const KEY_Y = 89
    const KEY_Z = 90

    switch (e.keyCode) {
        case KEY_E:
            UxSaverInstance.add('keyE')
            Preset.exportQuantomAutomata(new AppController().automata)
            break
        case KEY_U:
            UxSaverInstance.add('keyU')
            UxSaverInstance.export()
            break
        case KEY_Z:
            UxSaverInstance.add('keyZ')
            History.undo()
            UIControllerInstance._updateHistoryButtons()
            break
        case KEY_Y:
            UxSaverInstance.add('keyY')
            History.redo()
            UIControllerInstance._updateHistoryButtons()
            break
        case KEY_F:
            UxSaverInstance.add('keyF')
            AppControllerInstance.automata.lockBlock(EditorInstance.cursor.position)
            break
        case KEY_W:
            UxSaverInstance.add('keyW')
            new AppController().automata.addWaiting(EditorInstance.cursor.position)
        case KEY_P:
            UxSaverInstance.add('keyP')
            new AppController().automata.logBlock(EditorInstance.cursor.position)
            break
    }
})
