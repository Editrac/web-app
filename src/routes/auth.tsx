import React from "react";
import { useSelector } from "react-redux";
import { RouteProps, Navigate, Outlet } from "react-router-dom";
import { IState } from 'src/store/config';

const AuthRoute: React.FC<RouteProps> = ({ children }) => {
  const authenticated = useSelector((state: IState) => state.authReducer.authenticated);
  return (
    <>
      {!authenticated ? children : <Navigate to="/org" />}
    </>
  );
}

export default AuthRoute;
