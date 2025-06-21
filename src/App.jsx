import GameCanvas from "./components/GameCanvas";
import { useEffect } from "react";
import "./styles/App.css";

function App() {
  useEffect(() => {
    // Carregar fonte do Google Fonts
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Special+Elite&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Megálos</h1>
      </header>
      <main className="App-main">
        <div className="canvas-container">
          <div className="canvas-border"></div>
          <div className="canvas-wrapper">
            <GameCanvas />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
