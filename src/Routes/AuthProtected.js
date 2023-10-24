import React, { useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import { setAuthorization } from "../helpers/api_helper";
import { useProfile } from "../Components/Hooks/UserHooks";
import { getUserIdStorage } from "../helpers/common";


const AuthProtected = (props) => {
  const { userProfile, loading, token } = useProfile();
  const userId = getUserIdStorage();

  useEffect(() => {
    if (userProfile && !loading && token) {
      setAuthorization(token);
    }
  }, [token, userProfile, loading]);


  if (!userProfile && loading && !token) {
    return (
      <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
    );
  }

  return props.children;
};

const AccessRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        return (<Component {...props} />);
      }}
    />
  );
};

export { AuthProtected, AccessRoute };