import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useProfile } from "../../Components/Hooks/UserHooks";
import { useUserDetails } from "../../context/UserDetailContext";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
const Logout = () => {
  const { userProfile } = useProfile();
  const { dispatch } = useUserDetails();
  useEffect(() => {
    dispatch({ type: "LOGOUT_USER" });

  }, [userProfile])

  if (!userProfile) {
    return <Redirect to="/login" />;
  }

  return <></>;
};


export default Logout;