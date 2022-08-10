import React from 'react';
import { Field, FieldProps, Formik } from 'formik';
import * as Yup from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';
import { StyledInputBase } from 'src/components/input';
import Button from 'src/components/button/text.button';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import authApi from 'src/apis/auth'
import CircularProgress from '@material-ui/core/CircularProgress';
import { setAuthorizationHeader } from 'src/utils/axios';
import { useMutation } from 'src/utils/axios-hooks';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { authSignInAction, authOtpValidateAction, authSetPasswordAction } from 'src/store/auth/action';
import { useState } from 'react';

export const StepOne: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: signUp, response, error, loading } = useMutation<{}, { email: string }>(authApi.signup, {
    onSuccess: (_, v) => {
      navigate(`/signup?email=${v?.email}&step=2`)
    }
  });

  useEffect(() => {
    if (response) {
    }
  }, [response])

  const schema = Yup.object().shape({
    email: Yup.string().email().required(),
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
    organisationName: Yup.string().required(),
  });

  return (
    <Formik
      initialValues={{
        email: "",
        firstName: "",
        lastName: "",
        organisationName: ""
      }}
      validationSchema={schema}
      onSubmit={values => {
        signUp(values)
      }}
    >
      {(formikProps) => (
        <form onSubmit={formikProps.handleSubmit} className="text-left">
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
          <div className="mt-4"></div>
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
          <div className="mt-4"></div>
          <Field name="organisationName">
            {({ field, meta: { touched, error }, }: FieldProps) => (
              <>
                <p className="text-sm font-semibold px-1 flex justify-between">
                  <span>Organisation</span>
                  {touched && Boolean(error) && <span className="text-error font-normal">Required*</span>}
                </p>
                <StyledInputBase
                  {...field}
                  placeholder="Name of your organisation"
                  fullWidth
                  error={touched && Boolean(error)}
                />
              </>
            )}
          </Field>
          <div className="my-2 pb-4"></div>
          <Button type="submit" variant="fill-accent" size="large" fullWidth thick>
            {loading ? <CircularProgress color="secondary" size={20} thickness={5} /> : <span>Next &#8594;</span>}
          </Button>
          {error ? (
            <div className="text-error mt-4 text-center text-sm">{error.response?.data.message}</div>
          ) : null}
        </form>
      )}
    </Formik>

  )
}

export const StepTwo: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const query = new URLSearchParams(useLocation().search);
  const { mutate: validateOtp, response, loading } = useMutation(authApi.validateOtp);

  useEffect(() => {
    if (response) {
      setAuthorizationHeader(response.data.token);
      dispatch(authOtpValidateAction(response.data));
      navigate(`/signup?step=3`)
    }
  }, [response])

  const schema = Yup.object().shape({
    otp: Yup.string().required(),
  });

  return (
    <Formik
      initialValues={{
        otp: "",
      }}
      validationSchema={schema}
      onSubmit={values => {
        validateOtp({
          email: query.get("email"),
          otp: values.otp
        });
      }}
    >
      {(formikProps) => (
        <form onSubmit={formikProps.handleSubmit} className="text-left">
          <Field name="otp">
            {({ field, meta: { touched, error }, }: FieldProps) => (
              <>
                <p className="text-sm font-semibold px-1 flex justify-between">
                  <span>Enter OTP</span>
                  {touched && Boolean(error) && <span className="text-error font-normal">Required*</span>}
                </p>
                <StyledInputBase
                  {...field}
                  placeholder="Enter OTP here"
                  fullWidth
                  error={touched && Boolean(error)}
                />
              </>
            )}
          </Field>
          <div className="my-2 pb-4"></div>
          <Button type="submit" variant="fill-accent" size="large" fullWidth thick>
            {loading ? <CircularProgress color="secondary" size={20} thickness={5} /> : <span>Next &#8594;</span>}
          </Button>
        </form>
      )}
    </Formik>

  )
}

export const StepThree: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mutate: setPassword, loading } = useMutation(authApi.setPassword, {
    onSuccess: () => {
      dispatch(authSetPasswordAction());
      navigate("/org");
    }
  });

  const schema = Yup.object().shape({
    password: Yup.string().required(),
    rePassword: Yup.string().required(),
  });

  return (
    <Formik
      initialValues={{
        password: "",
        rePassword: ""
      }}
      validationSchema={schema}
      onSubmit={values => {
        setPassword({
          password: values.password
        });
      }}
    >
      {(formikProps) => (
        <form onSubmit={formikProps.handleSubmit} className="text-left">
          <Field name="password">
            {({ field, meta: { touched, error }, }: FieldProps) => (
              <>
                <p className="text-sm font-semibold px-1 flex justify-between">
                  <span>Password</span>
                  {touched && Boolean(error) && <span className="text-error font-normal">Required*</span>}
                </p>
                <StyledInputBase
                  {...field}
                  placeholder="Enter Passowrd here"
                  fullWidth
                  type="password"
                  error={touched && Boolean(error)}
                />
              </>
            )}
          </Field>
          <div className="mt-4"></div>
          <Field name="rePassword">
            {({ field, meta: { touched, error }, }: FieldProps) => (
              <>
                <p className="text-sm font-semibold px-1 flex justify-between">
                  <span>Confirm Password</span>
                  {touched && Boolean(error) && <span className="text-error font-normal">Required*</span>}
                </p>
                <StyledInputBase
                  {...field}
                  placeholder="Re enter the password"
                  fullWidth
                  type="password"
                  error={touched && Boolean(error)}
                />
              </>
            )}
          </Field>
          <div className="my-2 pb-4"></div>
          <Button type="submit" variant="fill-accent" size="large" fullWidth thick>
            {loading ? <CircularProgress color="secondary" size={20} thickness={5} /> : <span>Confirm &#8594;</span>}
          </Button>
        </form>
      )}
    </Formik>

  )
}