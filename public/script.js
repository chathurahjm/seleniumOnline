// Initialize CodeMirror
let editor = CodeMirror.fromTextArea(document.getElementById("code-editor"), {
    mode: "python",
    theme: "monokai",
    lineNumbers: true,
    autoCloseBrackets: true,
    indentUnit: 4,
    tabSize: 4,
    lineWrapping: true,
    viewportMargin: Infinity
});

// Function to run the code
async function runCode() {
    const outputElement = document.getElementById("output");
    const code = editor.getValue();
    
    try {
        outputElement.textContent = "Running code...";
        
        const response = await fetch('https://selenium-practice.onrender.com/execute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: code })
        });

        const data = await response.json();
        
        if (data.status === 'success') {
            outputElement.textContent = "Code executed successfully!\n\n" + data.message;
        } else {
            outputElement.textContent = "Error executing code:\n\n" + data.message;
            if (data.traceback) {
                outputElement.textContent += "\n\nTraceback:\n" + data.traceback;
            }
        }
    } catch (error) {
        outputElement.textContent = "Error connecting to server: " + error.message;
    }
}

// Function to clear the output
function clearOutput() {
    document.getElementById("output").textContent = "";
}

// Add keyboard shortcut (Ctrl/Cmd + Enter) to run code
editor.setOption("extraKeys", {
    "Ctrl-Enter": function(cm) {
        runCode();
    },
    "Cmd-Enter": function(cm) {
        runCode();
    }
});
