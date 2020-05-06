import React from "react";
import { useAuth } from "../../context/auth";
import { Switch, Route } from "react-router-dom";
import Login from "../Login";
import Authenticate from "../Authenticate";
import Dashboard from "../Dashboard";
import { CSSReset, ThemeProvider } from "@chakra-ui/core";

const App = () => {
  const { isAuthed } = useAuth();
  return (
    <ThemeProvider>
      {isAuthed ? (
        <Switch>
          <Route path="/" component={Dashboard} />
        </Switch>
      ) : (
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/authenticate" exact component={Authenticate} />
        </Switch>
      )}
      <CSSReset />
    </ThemeProvider>
  );
};

export default App;
