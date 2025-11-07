import { createRoot } from "react-dom/client"
import App from "./App.jsx"
import "./assets/styles/index.css"
import { initGA } from "./utils/analytics"

// Initialize Google Analytics
initGA()

createRoot(document.getElementById("root")).render(<App />)

