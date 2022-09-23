import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Online, Offline } from "react-detect-offline";

function App() {
    return (
        <div className="App">
            <Online>Vous êtes en mode en ligne !</Online>
            <Offline>Vous êtes en mode hors ligne !</Offline>
        </div>
    );
}

export default App;
