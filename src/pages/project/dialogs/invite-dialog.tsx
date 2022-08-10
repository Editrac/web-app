import React, { useEffect, useState } from 'react';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import Button from "src/components/button/text.button";
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import * as Yup from 'yup';
import { Field, FieldProps, Form, Formik } from 'formik';
import { useMutation } from 'src/utils/axios-hooks';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import { useQuery } from 'src/utils/axios-hooks';
import orgAPI from "src/apis/organisation";
import { IUser, UserRole } from 'src/store/auth/type';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputLabel from '@material-ui/core/InputLabel';
import Checkbox from '@material-ui/core/Checkbox';
import projectAPI from "src/apis/project"
import { IOrganisation, IProject } from 'src/store/organisation/type';

interface IProps {
  project: IProject;
  organisationId: string;
  open: boolean;
  setOpen: (open: boolean) => void
}

const InviteDialog: React.FC<IProps> = (props) => {
  const [selectedRole, setSelectedRole] = React.useState(UserRole.PROJECT_MANAGER);
  const [users, setUsers] = useState<IUser[]>([])

  const { query: getUsers, loading: usersLoading } = useQuery(orgAPI.getUsers, {
    onSuccess: (res) => {
      setUsers(res.data.users)
    }
  });

  useEffect(() => {
    if (props.open) {
      getUsers();
    }
  }, [props.open])

  const { mutate: addEditors, loading: addingEditors } = useMutation<any, any>(projectAPI.addEditors, {
    onSuccess: (data) => {
      handleDialogueClose();
    }
  });
  const { mutate: addManager, loading: addingManager } = useMutation<any, any>(projectAPI.addManager, {
    onSuccess: (data) => {
      handleDialogueClose();
    }
  });

  const handleDialogueClose = () => {
    props.setOpen(false)
  };

  const schema = Yup.object().shape({
    manager: Yup.string().when(selectedRole, {
      is: UserRole.PROJECT_MANAGER,
      then: Yup.string().required()
    }),
    editors: Yup.array().when(selectedRole, {
      is: UserRole.EDITOR,
      then: Yup.array()
        .of(
          Yup.string().required()
        )
        .min(1)
    }),
  });

  return (
    <Dialog
      open={props.open}
      onClose={handleDialogueClose}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <Formik
        initialValues={{ manager: props.project.manager?._id || "", editors: [] }}
        validationSchema={schema}
        onSubmit={(values) => {
          if (selectedRole === UserRole.EDITOR) {
            addEditors({
              organisation: props.organisationId,
              project: props.project._id,
              data: {
                editors: values.editors
              }
            })
          }
          else if (selectedRole === UserRole.PROJECT_MANAGER) {
            addManager({
              organisation: props.organisationId,
              project: props.project._id,
              data: {
                manager: values.manager
              }
            })
          }
        }}
      >
        {(formikProps) => (
          <Form className="bg-bg-dark text-primary rounded-xl overflow-hidden">
            <div className="bg-bg-light" style={{ width: 480 }}>
              <div className="text-sm font-bold py-3 px-7 border-b border-bg-dark flex items-center justify-between">
                <span>Project Manager</span>
                <IconButton onClick={handleDialogueClose} edge="end" aria-label="options" size="small" color="secondary">
                  <CloseRoundedIcon style={{ fontSize: 16 }} />
                </IconButton>
              </div>
              <div className="px-6 pt-4 max-h-80 overflow-y-auto">
                {users.map((user, index) => (
                  user.role === selectedRole &&
                  <InputLabel style={{ color: "inherit" }}>
                    <div className="flex border-b border-bg items-center cursor-pointer">
                      <div className="w-8 h-8 rounded-full bg-bg overflow-hidden">
                        {false ?
                          <img src={`${process.env.PUBLIC_URL}`} className="h-full w-full object-cover" /> :
                          <div className="h-full w-full flex items-center justify-center text-xs">
                            <span>{user.firstName[0]}{user.lastName[0]}</span>
                          </div>
                        }
                      </div>
                      <div className="flex flex-1 items-center pl-3 pr-1 py-4 text-sm">
                        {user.firstName} {user.lastName}
                      </div>
                      {selectedRole === UserRole.EDITOR ?
                        <Field type="checkbox" name="editors" value={user._id} >
                          {({ field }: FieldProps) => (
                            <Checkbox
                              {...field}
                              checked={field.checked}
                              color="primary"
                            />
                          )}
                        </Field> :
                        <Field type="radio" name="manager" value={user._id} >
                          {({ field }: FieldProps) => (
                            <Radio
                              {...field}
                              checked={field.checked}
                              icon={<RadioButtonUncheckedIcon style={{ color: "var(--grey-2)" }} />}
                              color="primary"
                            />
                          )}
                        </Field>}
                    </div>
                  </InputLabel>
                ))}
              </div>
              {usersLoading && <div className="text-center mt-4">
                <CircularProgress color="secondary" size={20} thickness={5} />
              </div>}
              <div className="p-6 text-right">
                <Button type="submit" size="medium" variant="fill-accent" >
                  {(addingEditors || addingManager) ? <CircularProgress color="secondary" size={20} thickness={5} /> : <strong className="text-sm">{selectedRole === UserRole.EDITOR ? "Editors" : "Done"} &#8594;</strong>}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Dialog>
  )
};

export default InviteDialog;
