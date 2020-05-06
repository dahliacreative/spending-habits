import React from "react";
import ReactDOM from "react-dom";
import App from "./pages/App";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { AuthProvider } from "./context/auth";

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Route path="/" component={App} />
      </Router>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
