import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import ContextWrapper from "./components/contexts/context_wrapper";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <ContextWrapper>
        <App />
      </ContextWrapper>
    </Router>
  </React.StrictMode>
);
