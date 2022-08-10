import React from 'react';
import { useSelector } from 'react-redux';
import { IState } from 'src/store/config';
import { IOrganisationType } from 'src/store/organisation/type';

const AuthComponent: React.FC<{ allowedRoles: string[], organisationType?: IOrganisationType }> = ({ allowedRoles, organisationType, children }) => {
  const { user } = useSelector((state: IState) => state.authReducer);
  if (user && allowedRoles.includes(user.role)) {
    if (organisationType && user.organisation?.organisationType !== organisationType) {
      return <></>
    }
    return <>{children}</>
  }
  return <></>
}

export default AuthComponent;