import React from "react";
import { Routes, Route } from "react-router-dom";
import Signin from "src/pages/auth/signin";
import Signup from "src/pages/auth/signup";
import AuthRoute from './auth';

const AuthRoutes: React.FC = () => (
  <>
    <Routes>
      <Route path="/signin" element={
        <AuthRoute>
          < Signin />
        </AuthRoute>
      } />
      <Route path="/signup" element={
        <AuthRoute>
          <Signup />
        </AuthRoute>
      } />
    </Routes>
  </>
);

export default AuthRoutes;
