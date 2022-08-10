import React, { useEffect, useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import AddOrganisationDialog from './dialogs/add-organisation-dialogue';
import { useDispatch, useSelector } from 'react-redux';
import { setOrganisationsAction, setSelectedOrganisationAction } from 'src/store/organisation/action';
import { useQuery } from 'src/utils/axios-hooks';
import organisationAPI from "src/apis/organisation";
import { IState } from 'src/store/config';
import { IOrganisation } from 'src/store/organisation/type';
import CircularProgress from '@material-ui/core/CircularProgress';
import AuthComponent from 'src/components/auth/auth.component';
import { UserRole } from 'src/store/auth/type';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import Popper, { PopperProps } from '@material-ui/core/Popper';

const ToolTipComponent = (organisation: IOrganisation, index: number) => (props: PopperProps) => {
  return (
    <Popper {...props} transition>
      <div className="ml-1 py-1 px-1 pr-2 rounded-lg text-xs border border-grey-1" style={{ backgroundColor: "var(--bgsolid)" }}>
        <div className="flex items-center font-semibold">
          <div className="h-6 w-6 bg-bg-light z-0 rounded-full overflow-hidden mr-2">
            {organisation.picture ?
              <img src={organisation.picture} className="h-full w-full object-cover" /> :
              <div className="h-full w-full flex items-center justify-center" style={{ fontSize: 10 }}>
                <span>{organisation.name.slice(0, 2)}</span>
              </div>
            }
          </div>
          <span>{organisation.name}</span>
        </div>
      </div>
    </Popper>
  )
}

const SideBar: React.FC = () => {
  const navigate = useNavigate();

  const { organisations } = useSelector((state: IState) => state.organisationReducer);
  const [addOrgDialog, setAddOrgDialog] = useState<boolean>(false);
  const dispatch = useDispatch();
  const colors = ["#003c66", "#443b7d", "#42133a", "#840032", "#b54b19", "#e59500", "#534f54", "#02040f"];
  const { orgId: selectedOrgId } = useParams<{ orgId: string }>();

  const { query: getOrganisations, loading: orgsLoading } = useQuery(organisationAPI.getOrganisations, {
    onSuccess: (res) => {
      const organisations: IOrganisation[] = res.data.organisations || []
      dispatch(setOrganisationsAction({
        organisations: organisations.map((org: IOrganisation, idx: number) => {
          return {
            ...org,
            projects: []
          }
        })
      }));
      if (organisations.length && !selectedOrgId) {
        navigate(`/org/${organisations[0]._id}`)
      }
    }
  });

  useEffect(() => {
    getOrganisations()
  }, [dispatch]);

  return (
    <div className="absolute inset-y-0 left-0 w-16 bg-bg-dark border-r-2 border-bg-dark py-4 flex flex-col items-center">
      <AddOrganisationDialog open={addOrgDialog} setOpen={setAddOrgDialog} />
      {organisations.map((organisation, index) => (
        <div key={index} className="w-full flex justify-center mb-3 relative">
          <div className={`absolute inset-y-2 -left-1 w-1 rounded-r-full bg-white transform transition-transform ${selectedOrgId === organisation._id && "translate-x-1"}`}></div>
          <Tooltip key={index} placement="right" PopperComponent={ToolTipComponent(organisation, index)} title={organisation.name}>
            <div
              key={index}
              className="w-10 h-10 rounded-xl bg-bg-light overflow-hidden cursor-pointer transform transition-transform hover:scale-110"
              role="button"
              onClick={selectedOrgId !== organisation._id ? () => {
                navigate(`/org/${organisation._id}`)
              } : undefined}
              style={{ backgroundColor: colors[index % 7] }}
            >
              {organisation.picture ?
                <img src={organisation.picture} className="h-full w-full object-contain" /> :
                <div className="h-full w-full flex items-center justify-center text-base font-bold">
                  <span>{organisation.name.slice(0, 2)}</span>
                </div>
              }
            </div>
          </Tooltip>
        </div>

      ))}
      <AuthComponent allowedRoles={[UserRole.ADMIN]}>
        <div className="w-12 h-12 rounded-full bg-bg mb-4 overflow-hidden cursor-pointer flex justify-center items-center">
          <IconButton onClick={() => setAddOrgDialog(true)} aria-label="delete" size="small" color="secondary">
            {orgsLoading ? <CircularProgress color="secondary" size={20} thickness={5} /> : <AddIcon style={{ fontSize: 30, color: "var(--grey-2)" }} />}
          </IconButton>
        </div>
      </AuthComponent>
    </div>
  );
};

export default SideBar;
