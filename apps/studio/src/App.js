import React from "react";

function App() {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>🛠️ Zarish Studio: Low-Code Builder</h1>
      <p>
        This is where the magic happens. Start dragging and dropping your **Lego
        Blocks** (UI components from the shared `packages/ui-kit`) here!
      </p>

      {/* TODO: Integrate a basic drag-and-drop environment here. 
        The sync-todos.js script will pick up this task!
      */}

      <button
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#00bcd4",
          color: "white",
          border: "none",
          borderRadius: "4px",
          marginTop: "15px",
        }}
      >
        Build Application
      </button>
    </div>
  );
}

export default App;
