import React from 'react';
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
import CircularProgress from '@material-ui/core/CircularProgress';
import { useNavigate } from 'react-router-dom';

interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AddOrganisationDialog: React.FC<IProps> = (props) => {
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const { mutate: createOrganisation, loading: orgCreating } = useMutation(orgAPI.createOrganisation, {
    onSuccess: (res) => {
      dispatch(addOrganisationAction({ organisation: { ...res.data.organisation, projects: [] } }));
      handleDialogueClose();
      navigate(`/org/${res.data.organisation._id}`)
    }
  });

  const handleDialogueClose = () => {
    props.setOpen(false)
  };

  const createOrganisationSchema = Yup.object().shape({
    organisationName: Yup.string().required(),
    userEmail: Yup.string().email().required(),
    userFirstName: Yup.string().required(),
    userLastName: Yup.string().required(),
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
        initialValues={{
          organisationName: "",
          userEmail: "",
          userFirstName: "",
          userLastName: ""
        }}
        validationSchema={createOrganisationSchema}
        onSubmit={(values) => {
          createOrganisation(values)
        }}
      >
        {(formikProps) => (
          <Form className="bg-bg-dark text-primary rounded-xl overflow-hidden">
            <div className="bg-bg-light w-96">
              <div className="text-base font-bold py-3 px-7 border-b border-bg-dark flex items-center justify-between">
                <span>Add Client</span>
                <IconButton onClick={handleDialogueClose} edge="end" aria-label="options" size="small" color="secondary">
                  <CloseRoundedIcon style={{ fontSize: 16 }} />
                </IconButton>
              </div>
              <div className="p-6">
                <Field name="organisationName">
                  {({ field, meta: { touched, error }, }: FieldProps) => (
                    <>
                      <p className="text-sm px-1 font-semibold flex justify-between">
                        <span>Company</span>
                        {touched && Boolean(error) && <span className="text-error font-normal">Required*</span>}
                      </p>
                      <StyledInputBase
                        {...field}
                        placeholder="Enter Project name here"
                        fullWidth
                        error={touched && Boolean(error)}
                      />
                    </>
                  )}
                </Field>
                <div className="mt-6"></div>
                <Field name="userEmail">
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
                  <span>Contact Person</span>
                  {(
                    (formikProps.touched.userFirstName && Boolean(formikProps.errors.userFirstName)) ||
                    (formikProps.touched.userLastName && Boolean(formikProps.errors.userLastName))
                  ) && <span className="text-error font-normal">Required*</span>}
                </p>
                <div className="flex">
                  <Field name="userFirstName">
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
                  <Field name="userLastName">
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

export default AddOrganisationDialog;
