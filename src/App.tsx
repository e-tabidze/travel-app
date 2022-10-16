import React from "react";

import Header from "./Components/Header/Header";
import Routing from "./Routing/Routing";

import { CssBaseline } from "@mui/material";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Header />
      <CssBaseline />
      <Routing />
    </div>
  );
}

export default App;
