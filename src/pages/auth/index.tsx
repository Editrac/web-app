import React from 'react';
import { useSelector } from 'react-redux';
import { IState } from 'src/store/config';
import { Outlet } from 'react-router-dom';

const AuthPage: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-bg-dark">
      <div className="absolute inset-y-0 right-0" style={{ background: "var(--accent-shade)", width: "45%" }}>
      </div>
      <div className="absolute inset-y-0 left-0 p-12 overflow-y-auto overflow-x-hidden" style={{ width: "55%" }}>
        <div className="text-xl flex items-center font-semibold justify-between">
          <div className="flex items-center">
            <div className="w-7 h-7 rounded-full bg-accent mr-2 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-bg-dark m-auto"></div>
            </div>
            <span>ediflo</span>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export default AuthPage;
