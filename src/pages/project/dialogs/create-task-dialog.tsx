import React, { useEffect, useState } from 'react';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import Button from "src/components/button/text.button";
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import * as Yup from 'yup';
import { Field, FieldProps, Form, Formik } from 'formik';
import { StyledInputBase } from 'src/components/input';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQuery } from 'src/utils/axios-hooks';
import projectAPI from 'src/apis/project'
import CircularProgress from '@material-ui/core/CircularProgress';
import { IOrganisation, IProject, IProjectTask } from 'src/store/organisation/type';
import { IUser } from 'src/store/auth/type';
import orgAPI from "src/apis/organisation"
import useAutocomplete from '@material-ui/lab/useAutocomplete';
import { updateProjectAction } from 'src/store/organisation/action';
import { IState } from 'src/store/config';

interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAddTask: (task: IProjectTask) => void;
  organisationId: string;
  project: IProject;
}

const CreateTaskDialog: React.FC<IProps> = (props) => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState<IUser[]>([])

  const { mutate: createProjectTask, loading: taskCreating } = useMutation<any, any>(projectAPI.createProjectTasks, {
    onSuccess: (res) => {
      let task = res.data.projectTask;
      if ((task)) {
        task.editor = users.find((user) => user._id === task.editor)
      }
      props.onAddTask(task)
      handleDialogueClose();
    }
  });

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

  const handleDialogueClose = () => {
    props.setOpen(false)
  };

  const createProjectSchema = Yup.object().shape({
    name: Yup.string().required(),
    description: Yup.string().required(),
    editor: Yup.string().required()
  });

  const {
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value: selectedEditor
  } = useAutocomplete({
    id: 'use-autocomplete-demo',
    options: users,
    getOptionLabel: (option) => `${option.firstName} ${option.lastName}`
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
        enableReinitialize
        initialValues={{ name: "", description: "", editor: "" }}
        validationSchema={createProjectSchema}
        onSubmit={(values) => {
          createProjectTask({
            organisation: props.organisationId,
            project: props.project._id,
            data: values
          })
        }}
      >
        {(formikProps) => (
          <Form className="bg-bg-dark text-primary rounded-xl overflow-hidden">
            <div className="bg-bg-light" style={{ width: 600 }}>
              <div className="text-base font-bold py-3 px-7 border-b border-bg-dark flex items-center justify-between">
                <span>Add task</span>
                <IconButton onClick={handleDialogueClose} edge="end" aria-label="options" size="small" color="secondary">
                  <CloseRoundedIcon style={{ fontSize: 16 }} />
                </IconButton>
              </div>
              {(!users.length && usersLoading) ?
                <div className="pl-3 mt-2 h-20 flex items-center justify-center">
                  <CircularProgress color="secondary" size={20} thickness={5} />
                </div>
                : <div className="p-6">
                  <div className="flex">
                    <div className="flex flex-col flex-1">
                      <Field name="name">
                        {({ field, meta: { touched, error }, }: FieldProps) => (
                          <>
                            <p className="text-xs px-1 font-semibold flex justify-between">
                              <span>Task Name</span>
                              {touched && Boolean(error) && <span className="text-error font-normal">Required*</span>}
                            </p>
                            <StyledInputBase
                              {...field}
                              placeholder="Enter Task name here"
                              fullWidth
                              error={touched && Boolean(error)}
                            />
                          </>
                        )}
                      </Field>
                    </div>
                    <span className="px-1"></span>
                    <div className="flex flex-col flex-1 relative">

                      <p className="text-xs px-1 font-semibold flex justify-between">
                        <span>Assign to</span>
                        {formikProps.touched.editor && Boolean(formikProps.errors.editor) && <span className="text-error font-normal">Required*</span>}
                      </p>
                      <StyledInputBase
                        {...getInputProps()}
                        placeholder="Enter Task name here"
                        fullWidth
                        error={formikProps.touched.editor && Boolean(formikProps.errors.editor)}
                      />
                      {groupedOptions.length > 0 ? (
                        <div className="absolute inset-x-0 top-16 h-56 bg-bg-dark z-10 rounded-xl overflow-hidden">
                          <div className="h-full w-full bg-bg px-4 overflow-y-auto" {...getListboxProps()}>
                            {groupedOptions.map((option, index) => (
                              <div {...getOptionProps({ option, index })}>
                                <div onClick={() => formikProps.setFieldValue("editor", option._id)} className="flex border-b border-bg items-center cursor-pointer">
                                  <div className="w-8 h-8 rounded-full bg-bg overflow-hidden">
                                    {false ?
                                      <img src={`${process.env.PUBLIC_URL}`} className="h-full w-full object-cover" /> :
                                      <div className="h-full w-full flex items-center justify-center text-xs">
                                        <span>{option.firstName[0]}{option.lastName[0]}</span>
                                      </div>
                                    }
                                  </div>
                                  <div className="flex flex-1 items-center pl-3 pr-1 py-4 text-sm">
                                    {option.firstName} {option.lastName}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-6"></div>
                  <Field name="description">
                    {({ field, meta: { touched, error }, }: FieldProps) => (
                      <>
                        <p className="text-xs px-1 font-semibold flex justify-between">
                          <span>Description</span>
                          {touched && Boolean(error) && <span className="text-error font-normal">Required*</span>}
                        </p>
                        <StyledInputBase
                          {...field}
                          multiline
                          rowsMax={6}
                          rows={6}
                          placeholder="Task Description"
                          fullWidth
                          error={touched && Boolean(error)}
                        />
                      </>
                    )}
                  </Field>
                  <div className="pt-6">
                    <Button type="submit" size="large" variant="fill-accent" fullWidth >
                      {taskCreating ? <CircularProgress color="secondary" size={20} thickness={5} /> : <strong className="text-sm">Add Task &#8594;</strong>}
                    </Button>
                  </div>
                </div>}
            </div>
          </Form>
        )}
      </Formik>
    </Dialog >
  )
};

export default CreateTaskDialog;
