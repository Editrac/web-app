import React from "react";
import { useSelector } from "react-redux";
import { Navigate, RouteProps } from "react-router-dom";
import { IState } from 'src/store/config';

const UserRoute: React.FC<RouteProps> = ({ children }) => {
  const { authenticated, password } = useSelector((state: IState) => state.authReducer);
  return (
    <>
      {(authenticated && password) ? children : <Navigate to="/signin" />}
    </>
  )
};

export default UserRoute;
