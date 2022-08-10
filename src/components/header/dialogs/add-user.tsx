import React, { useState } from 'react';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import Button from "src/components/button/text.button";
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import * as Yup from 'yup';
import { Field, FieldProps, Form, Formik } from 'formik';
import { StyledInputBase } from 'src/components/input';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation } from 'src/utils/axios-hooks';
import orgAPI from 'src/apis/organisation'
import { addOrganisationAction } from 'src/store/organisation/action';
import { IState } from 'src/store/config';
import CircularProgress from '@material-ui/core/CircularProgress';
import { UserRole } from 'src/store/auth/type';

interface IProps {
  role: UserRole;
  open: boolean;
  setOpen: (open: boolean, reload: boolean) => void;
}

const AddUserDialog: React.FC<IProps> = (props) => {
  const dispatch = useDispatch();

  const { mutate: createOrganisation, loading: orgCreating } = useMutation(orgAPI.addUser, {
    onSuccess: (res) => {
      handleDialogueClose(true);
    }
  });

  const handleDialogueClose = (reload: boolean) => {
    props.setOpen(false, reload)
  };

  const schema = Yup.object().shape({
    email: Yup.string().email().required(),
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
    role: Yup.string().required(),
  });

  return (
    <Dialog
      open={props.open}
      onClose={() => handleDialogueClose(false)}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <Formik
        enableReinitialize
        initialValues={{
          email: "",
          firstName: "",
          lastName: "",
          role: props.role
        }}
        validationSchema={schema}
        onSubmit={(values) => {
          createOrganisation(values)
        }}
      >
        {(formikProps) => (
          <Form className="bg-bg-dark text-primary rounded-xl overflow-hidden">
            <div className="bg-bg-light w-96">
              <div className="text-base font-bold py-3 px-7 border-b border-bg-dark flex items-center justify-between">
                <span>{props.role === UserRole.PROJECT_MANAGER ? "Add a project manager" : "Add an editor"}</span>
                <IconButton onClick={() => handleDialogueClose(false)} edge="end" aria-label="options" size="small" color="secondary">
                  <CloseRoundedIcon style={{ fontSize: 16 }} />
                </IconButton>
              </div>
              <div className="p-6">
                <Field name="email">
                  {({ field, meta: { touched, error }, }: FieldProps) => (
                    <>
                      <p className="text-sm font-semibold px-1 flex justify-between">
                        <span>Email</span>
                        {touched && Boolean(error) && <span className="text-error font-normal">Required*</span>}
                      </p>
                      <StyledInputBase
                        {...field}
                        placeholder="Enter your email here"
                        fullWidth
                        error={touched && Boolean(error)}
                      />
                    </>
                  )}
                </Field>
                <div className="mt-6"></div>
                <p className="text-sm font-semibold px-1 flex justify-between">
                  <span>Name</span>
                  {(
                    (formikProps.touched.firstName && Boolean(formikProps.errors.firstName)) ||
                    (formikProps.touched.lastName && Boolean(formikProps.errors.lastName))
                  ) && <span className="text-error font-normal">Required*</span>}
                </p>
                <div className="flex">
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
                <div className="pt-8">
                  <Button type="submit" size="large" variant="fill-accent" fullWidth >
                    {orgCreating ? <CircularProgress color="secondary" size={20} thickness={5} /> : <strong className="text-sm">Add &#8594;</strong>}
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Dialog >
  )
};

export default AddUserDialog;
