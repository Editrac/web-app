import React, { useEffect } from 'react';
import SideBar from './sidebar';
import { IState } from 'src/store/config';
import { useSelector, useDispatch } from 'react-redux';
import NavBar from './navbar';
import ProjectPage from '../project';
import { Routes, Route, useParams, Outlet } from 'react-router-dom';
import { setAuthEvaporateClientAction } from 'src/store/auth/action';
import { getEvaporateClient } from 'src/utils/evaporate';
import AppHeader from 'src/components/header';

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const { orgId: selectedOrgId } = useParams<{ orgId: string }>();

  useEffect(() => {
    getEvaporateClient().then((_e_) => dispatch(setAuthEvaporateClientAction({ _e_ })))
  }, []);

  return (
    <div className="absolute inset-0 bg-bg-dark">
      <SideBar />
      <div className="absolute inset-y-0 left-16 w-64 bg-bg py-4 px-3" style={{ width: "17rem" }}>
        {selectedOrgId && <NavBar />}
      </div>
      <div className="absolute inset-y-0 right-0 flex flex-col bg-bg-light" style={{ left: "21rem" }}>
        <div className="absolute inset-x-0 h-12 top-0 flex items-end mx-6 z-10">
          <div className="flex flex-1 items-center"></div>
          <AppHeader />
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default HomePage;
