import React from "react";

//import Scss
import "./assets/scss/themes.scss";

//imoprt Route
import Route from "./Routes";
import "antd/dist/antd.variable.min.css";
import "./App.css";

import { UserDetailProvider } from './context/UserDetailContext';

function App() {
  return (
    <UserDetailProvider>
      <Route />
    </UserDetailProvider>
  );
}

export default App;
