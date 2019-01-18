/* 
    global 
    ThreeViewControllerInstance,
    Qubit,
    Dot,
    Electron,
    ToolboxControllerInstance,
    InputBlock,
    QubitEditor,
    QubitEditorInstance,
*/
/* 
    global 
    ThreeViewControllerInstance,
    Qubit,
    Dot,
    Electron,
    ToolboxControllerInstance,
    InputBlock,
    QubitEditor,
    QubitEditorInstance,
    QuantumAutomata,
*/

AppControllerInstance.init().then(() => {
    AppControllerInstance.startUpdateLoop()
})