import React, { useState, MouseEvent, useCallback } from 'react';
import NotificationsRoundedIcon from '@material-ui/icons/NotificationsRounded';
import PersonRoundedIcon from '@material-ui/icons/PersonRounded';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { authSignOutAction, updateUserAction } from 'src/store/auth/action';
import { useNavigate } from 'react-router-dom';
import { IState } from 'src/store/config';
import Dialog from '@material-ui/core/Dialog';
import { Field, FieldProps, Form, Formik } from 'formik';
import Button from '../button/text.button';
import { useMutation } from 'src/utils/axios-hooks';
import { useDropzone } from 'react-dropzone';
import { StyledInputBase } from '../input';
import userAPI from "src/apis/user"
import { UserRole } from 'src/store/auth/type';
import OrganisationSetting from './organisation-settings';
import Avatar from '../avatar';

interface IProps {
}

const AppHeader: React.FC<IProps> = (props) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: IState) => state.authReducer);
  const [popoverState, setPopoverState] = useState<{ anchorEl: any, name: string | null }>({ anchorEl: null, name: null });
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const { _e_ } = useSelector((state: IState) => state.authReducer);
  const [imageKey, setImageKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [orgSettingOpen, setOrgSettingOpen] = useState<boolean>(false);

  const { mutate: updateUser } = useMutation<any, any>(userAPI.updateUser, {
    onSuccess: ({ data }, variables) => {
      setLoading(false);
      dispatch(updateUserAction({
        user: {
          ...data.user,
          organisation: user?.organisation
        }
      }));
      setImageKey('');
    }
  });

  const onDrop = useCallback((files: File[]) => {
    if (_e_) {
      setLoading(true);
      const filePromises = [];
      if (files) {
        for (var i = 0; i < files.length; i++) {
          const name = files[i].name;
          const lastDot = name.lastIndexOf('.');
          const ext = name.substring(lastDot + 1);
          const file = `${uuidv4()}.${ext}`;
          const promise = _e_
            .add({
              name: file,
              file: files[i],
              started: function (fileKey) {
                setImageKey(fileKey);
              },
              complete: () => {
                updateUser({
                  user: user?._id,
                  data: {
                    firstName: user?.firstName,
                    lastName: user?.lastName,
                    picture: file
                  }
                });
                setImageKey(file);
              }
            });
          filePromises.push(promise);
        }
        Promise.all(filePromises).catch((err) => console.log(err));
      }
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

  const handleClick = (e: any, name: string) => {
    setPopoverState({ anchorEl: e.currentTarget, name });
  };
  const handleClose = () => {
    setPopoverState({ anchorEl: null, name: popoverState.name });
  };
  const open = Boolean(popoverState.anchorEl);

  const schema = Yup.object().shape({
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
  });

  if (!user) {
    return null
  }

  return (
    <div className="flex justify-end items-center text-sm">
      {orgSettingOpen && <OrganisationSetting handleClose={() => setOrgSettingOpen(false)} />}
      <Popover
        id={"APP_HEADER_POPOVER"}
        open={open}
        anchorEl={popoverState.anchorEl}
        onClose={handleClose}
        elevation={8}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div className="bg-bg-dark text-primary rounded-xl overflow-hidden">
          <div className="bg-bg-light">
            <div className="bg-bg-light w-40">
              <div
                onClick={() => {
                  handleClose();
                  setDialogOpen(true)
                }}
                className="py-3 px-4 border-b border-bg-dark text-sm cursor-pointer hover:bg-bg flex items-center"
              >
                <PersonRoundedIcon fontSize="inherit" />
                <span className="ml-1">Profile</span>
              </div>
              <div onClick={() => dispatch(authSignOutAction())} className="py-3 px-4 text-sm cursor-pointer hover:bg-bg flex items-center">
                <ExitToAppRoundedIcon fontSize="inherit" />
                <span className="ml-1">Log out</span>
              </div>
            </div>
          </div>

        </div>
      </Popover>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <Formik
          enableReinitialize
          initialValues={{ firstName: user.firstName, lastName: user.lastName, picture: "" }}
          validationSchema={schema}
          onSubmit={(values) => {
            updateUser({
              user: user?._id,
              data: {
                firstName: values.firstName,
                lastName: values.lastName,
                picture: imageKey
              }
            });
          }}
        >
          {() => (
            <Form className="bg-bg-dark text-primary rounded-lg overflow-hidden">
              <div className="bg-bg-light" style={{ width: 500 }}>
                <div className="text-base font-bold py-5 px-11 border-b border-bg-dark flex items-center justify-between">
                  <span>Update Profile</span>
                  <IconButton onClick={() => setDialogOpen(false)} edge="end" aria-label="options" size="small" color="secondary">
                    <CloseRoundedIcon style={{ fontSize: 16 }} />
                  </IconButton>
                </div>
                <div className="p-10">
                  <div className="w-32 text-center">
                    <div className="w-32 h-32 border-2 border-dashed border-bg rounded-xl">
                      {loading ?
                        <div className="h-32 border-2 border-dashed border-grey-1 rounded-xl m-4 cursor-pointer flex items-center justify-center flex-col">
                          <CircularProgress color="secondary" size={20} thickness={5} />
                        </div>
                        : <div><img src={user.picture} className="h-full w-full object-cover" /></div>}
                    </div>
                    <Button type="button" variant="text-accent" size="medium" fullWidth>
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p className="text-sm font-semibold">Upload Image</p>
                      </div>
                    </Button>
                  </div>
                  <div className="flex mt-2">
                    <Field name="firstName">
                      {({ field, meta: { touched, error }, }: FieldProps) => (
                        <StyledInputBase
                          {...field}
                          placeholder="First Name"
                          fullWidth
                          error={touched && Boolean(error)}
                        />
                      )}
                    </Field>
                    <span className="px-1"></span>
                    <Field name="lastName">
                      {({ field, meta: { touched, error }, }: FieldProps) => (
                        <StyledInputBase
                          {...field}
                          placeholder="Last Name"
                          fullWidth
                          error={touched && Boolean(error)}
                        />
                      )}
                    </Field>
                  </div>
                  <div className="mt-8 w-32">
                    <Button type="submit" size="regular" variant="fill-accent" fullWidth>
                      <span className="font-semibold">Save</span>
                    </Button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Dialog>
      <div onClick={[UserRole.ADMIN, UserRole.PROJECT_MANAGER].includes(user.role as UserRole) ? () => setOrgSettingOpen(true) : undefined} className={`flex items-center rounded-lg pr-3 ${[UserRole.ADMIN, UserRole.PROJECT_MANAGER].includes(user.role as UserRole) ? "cursor-pointer hover:bg-bg" : ""} `}>
        <div className="w-8 h-8 rounded-lg bg-bg overflow-hidden">
          {user.organisation?.picture ?
            <img src={user.organisation.picture} className="h-full w-full object-contain" /> :
            <div className="h-full w-full flex items-center justify-center text-base font-bold">
              <span>{user.organisation?.name.slice(0, 2)}</span>
            </div>
          }
        </div>
        <p className="text-sm font-semibold ml-2">Settings</p>
      </div>
      <div className="h-8 w-8 rounded-full flex justify-center items-center bg-grey-1 ml-8">
        <IconButton aria-label="delete" size="small" color="secondary">
          <NotificationsRoundedIcon fontSize="inherit" />
        </IconButton>
      </div>
      <div onClick={(e) => handleClick(e, "ACCOUNT")} className="h-8 w-8 rounded-full flex justify-center items-center bg-grey-1 ml-2 overflow-hidden cursor-pointer">
        <Avatar size={8} initials={`${user.firstName[0]}${user.lastName[0]}`} image={user.picture} />
      </div>
    </div>
  );
};

export default AppHeader;
