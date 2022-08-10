import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import GroupRoundedIcon from '@material-ui/icons/GroupRounded';
import AssignmentIcon from '@material-ui/icons/Assignment';
import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from '@material-ui/core/IconButton';
import Button from 'src/components/button/text.button';
import { useSelector } from 'react-redux';
import { IState } from 'src/store/config';
import ManageTeam from './team';
import BasicSettings from './basic';
import ProjectQuestions from './project-questions';
import { UserRole } from 'src/store/auth/type';
import { IOrganisationType } from 'src/store/organisation/type';
import AuthComponent from 'src/components/auth/auth.component';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import PaymentIcon from '@material-ui/icons/Payment';
import Members from './members';

interface IProps {
  handleClose: () => void
}
const orgSettingsItems = [{
  type: "BASIC",
  name: "Basic",
  title: "Basic Settings",
  icon: <SettingsIcon fontSize="small" color="primary" />,
  alloweRoles: [UserRole.ADMIN]
},
{
  type: "MEMBERS",
  name: "Members",
  title: "Manage Organisation Members",
  icon: <GroupRoundedIcon fontSize="small" color="primary" />,
  alloweRoles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER]
},
{
  type: "TEAMS",
  name: "Teams",
  title: "Manage Teams",
  icon: <GroupWorkIcon fontSize="small" color="primary" />,
  alloweRoles: [UserRole.ADMIN, UserRole.PROJECT_MANAGER]
},
{
  type: "PROJECT_FORM",
  name: "Project Templates",
  title: "Manage Project Templates",
  icon: <AssignmentIcon fontSize="small" color="primary" />,
  alloweRoles: [UserRole.ADMIN],
  organisationType: IOrganisationType.EDITING
},
{
  type: "PAYMENTS",
  name: "Payment",
  title: "Payment Setup",
  icon: <PaymentIcon fontSize="small" color="primary" />,
  alloweRoles: [UserRole.ADMIN],
  organisationType: IOrganisationType.EDITING
}
]

const OrganisationSetting: React.FC<IProps> = ({ handleClose }) => {
  let history = useNavigate();
  const { user } = useSelector((state: IState) => state.authReducer);
  const [activeSetting, setActiveSetting] = useState<number>(user?.role === UserRole.ADMIN ? 0 : 1);

  return (
    <div className="fixed inset-0 z-10 flex justify-center">
      <div role="button" onClick={() => handleClose()} className="fixed inset-0 -z-1 bg-bg-dark opacity-90"></div>
      <div className=" absolute inset-x-16 inset-y-5 rounded-xl overflow-hidden z-15 bg-bg-dark border border-grey-1">
        <div className="p-6 bg-bg flex relative h-full w-full" >
          <div className="absolute inset-y-0 left-0 w-72 border-r border-grey-1 py-5 px-3">
            <div className="flex items-center pb-5">
              <IconButton onClick={() => handleClose()} aria-label="delete" size="small" color="secondary">
                <ArrowBackIcon style={{ fontSize: 22 }} />
              </IconButton>
              <span className="ml-2 text-sm font-bold">Organisation Setup</span>
            </div>
            <div className="flex rounded-md px-2 border border-grey-1 border-solid">
              <div className="flex items-center py-2">
                <div className="w-12 h-12 rounded-md bg-bg overflow-hidden">
                  {user?.organisation.picture ?
                    <img src={user.organisation.picture} className="h-full w-full object-contain" /> :
                    <div className="h-full w-full flex items-center justify-center text-base font-bold">
                      <span>{user?.organisation.name.slice(0, 2)}</span>
                    </div>
                  }
                </div>
              </div>
              <div className="flex flex-1 items-center pl-3 pr-1 py-4">
                <span className="text-sm font-semibold">{user?.organisation.name}</span>
              </div>
            </div>
            <div className="mt-8"></div>
            {orgSettingsItems.map((item, index) =>
              <AuthComponent allowedRoles={item.alloweRoles} organisationType={item.organisationType}>
                <div
                  onClick={() => {
                    if (index !== activeSetting) {
                      setActiveSetting(index)
                    }
                  }}
                  key={index}
                  className={`group flex items-start ${activeSetting === index && 'bg-bg'}  -mx-0 px-4 rounded-md py-3 cursor-pointer hover:bg-bg-light`}
                >
                  {item.icon}
                  <div className="flex flex-1 text-sm font-semibold items-center ml-2">{item.name}</div>
                </div>
              </AuthComponent>
            )}
          </div>
          <div className="absolute inset-y-0 left-72 right-0">
            <div className="absolute inset-x-0 flex justify-between items-center border-b border-bg h-16 px-10">
              <p className="text-sm font-semibold">{orgSettingsItems[activeSetting].title}</p>
            </div>
            {user && <div className="absolute inset-0 top-16 overflow-y-auto">
              {activeSetting === 0 && <BasicSettings user={user} />}
              {activeSetting === 1 && <Members />}
              {activeSetting === 2 && <ManageTeam />}
              {activeSetting === 3 && <ProjectQuestions user={user} />}
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganisationSetting;
