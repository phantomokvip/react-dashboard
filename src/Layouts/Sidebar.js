import React, { useEffect } from "react";
import { Container } from "reactstrap";
import SimpleBar from "simplebar-react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
//Import Components
import VerticalLayout from "./VerticalLayouts";

const Sidebar = ({ layoutType }) => {
  useEffect(() => {
    var verticalOverlay = document.getElementsByClassName("vertical-overlay");
    if (verticalOverlay) {
      verticalOverlay[0].addEventListener("click", function () {
        document.body.classList.remove("vertical-sidebar-enable");
      });
    }
  });
  const addEventListenerOnSmHoverMenu = () => {
    // add listener Sidebar Hover icon on change layout from setting
    if (
      document.documentElement.getAttribute("data-sidebar-size") === "sm-hover"
    ) {
      document.documentElement.setAttribute(
        "data-sidebar-size",
        "sm-hover-active"
      );
    } else if (
      document.documentElement.getAttribute("data-sidebar-size") ===
      "sm-hover-active"
    ) {
      document.documentElement.setAttribute("data-sidebar-size", "sm-hover");
    } else {
      document.documentElement.setAttribute("data-sidebar-size", "sm-hover");
    }
  };
  return (
    <>
      <div className="app-menu navbar-menu">
        <div className="navbar-brand-box">
          <Link to="/" className="logo logo-dark">
            <span className="logo-sm">
              <img src={logo} alt="" height="13" />
            </span>
            
            <img className="brand-text" src={logo} alt="" height="50" />
           
          </Link>

          <Link to="/" className="logo logo-light">
            <span className="logo-sm">
              <img src={logo} alt="" height="13" />
            </span>
            <span className="logo-lg">
              <img src={logo} alt="" height="13" />
            </span>
          </Link>
          <button
            onClick={addEventListenerOnSmHoverMenu}
            type="button"
            className="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover"
            id="vertical-hover"
          >
            <i className="ri-record-circle-line"></i>
          </button>
          
            <SimpleBar id="scrollbar" className="h-100">
              <Container fluid>
                <div id="two-column-menu"></div>
                <ul className="navbar-nav" id="navbar-nav">
                  <VerticalLayout layoutType={layoutType} />
                </ul>
              </Container>
            </SimpleBar>
          
          <div className="sidebar-background"></div>
        </div>
      </div>
      <div className="vertical-overlay"></div>
    </>
  );
};
export default Sidebar;
