import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import AuthRoute from './auth';
import UserRoute from './user';
import AuthPage from "src/pages/auth";
import PlayerPage from 'src/pages/player';
import HomePage from 'src/pages/home';
import ProjectPage from 'src/pages/project';
import Signin from 'src/pages/auth/signin';
import Signup from 'src/pages/auth/signup';

const IndexRoute: React.FC = () => {
  return (
    <div className="app-root">
      <Routes>
        <Route path='/' element={<AuthRoute><AuthPage /></AuthRoute>} >
          <Route index element={<Signin />} />
          <Route path="signin" element={<Signin />} />
          <Route path="signup" element={<Signup />} />
        </Route>
        <Route path='org' element={
          <UserRoute >
            <Outlet />
          </UserRoute>
        } >
          <Route index element={<HomePage />} />
          <Route path=":orgId" element={<HomePage />} >
            <Route path="project" element={<Outlet />} >
              <Route index element={<ProjectPage />} />
              <Route path=':projectId' element={<ProjectPage />} />
            </Route >
          </Route>
          <Route />
        </Route>
        <Route path="player/:videoId" element={
          <UserRoute >
            <PlayerPage />
          </UserRoute>
        } />
      </Routes>
    </div>
  )
};

export default IndexRoute;

