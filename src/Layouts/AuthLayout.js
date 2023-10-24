import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

const AuthLayout = (props) => {
  return (
    <React.Fragment>
      <div id="layout-wrapper">
        <Header
          headerClass={""}
        />
        <Sidebar layoutType={"vertical"} />
        <div className="main-content">
          {props.children}
        </div>
      </div>
    </React.Fragment>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.object,
};

export default withRouter(AuthLayout);
