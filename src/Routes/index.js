import React from "react";
import { Switch, Route } from "react-router-dom";

//Layouts
import NonAuthLayout from "../Layouts/NonAuthLayout";
import AuthLayout from "../Layouts/AuthLayout";
//routes
import { authProtectedRoutes, publicRoutes } from "./allRoutes";
import { AuthProtected, AccessRoute } from "./AuthProtected";

const Index = () => {
  const availablePublicRoutesPaths = publicRoutes.map((r) => r.path);
  const availableAuthRoutesPath = authProtectedRoutes.map((r) => r.path);
  return (
    <Switch>
      <Route path={availablePublicRoutesPaths}>
        <NonAuthLayout>
          <Switch>
            {publicRoutes.map((route, idx) => (
              <Route
                path={route.path}
                component={route.component}
                key={idx}
                exact={true}
              />
            ))}
          </Switch>
        </NonAuthLayout>
      </Route>

      <Route path={availableAuthRoutesPath}>
        <AuthProtected>
          <AuthLayout>
            <Switch>
              {authProtectedRoutes.map((route, idx) => (
                <AccessRoute
                  path={route.path}
                  component={route.component}
                  key={idx}
                  exact={true}
                />
              ))}
            </Switch>
          </AuthLayout>
        </AuthProtected>
      </Route>
    </Switch>
  );
};

export default Index;
