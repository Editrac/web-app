import React from 'react';
import { Field, FieldProps, Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { StyledInputBase } from 'src/components/input';
import Button from 'src/components/button/text.button'
import { useMutation } from 'src/utils/axios-hooks';
import authApi from 'src/apis/auth'
import CircularProgress from '@material-ui/core/CircularProgress';
import { setAuthorizationHeader } from 'src/utils/axios';
import { authSignInAction } from 'src/store/auth/action';
import { IUser } from 'src/store/auth/type';
import { IState } from 'src/store/config';
import { useNavigate } from 'react-router-dom';

interface APIResponse {
  success: boolean;
  message?: string;
}

interface SigninData {
  token: string;
  user: IUser
}

interface SinginResponse extends APIResponse {
  data: SigninData
}

const Authenticate: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authenticated, password } = useSelector((state: IState) => state.authReducer);
  const { mutate: signIn, error, loading } = useMutation<SinginResponse>(authApi.signin, {
    onSuccess: ({ data }) => {
      setAuthorizationHeader(data.token);
      dispatch(authSignInAction({ authenticated, password, user: data.user, token: data.token }));
    }
  });

  const schema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
  });

  return (
    <>
      <div className="max-w-sm m-auto bg-bg rounded-t-2xl rounded-b-lg px-10 py-6 mt-20">
        <p className="text-lg font-bold">Sign in</p>
        <p className="text-sm mt-0.5">Sign in to your account to continue</p>
      </div>
      <div className="max-w-sm m-auto bg-bg rounded-lg pt-8 pb-10 px-10 mt-0.5">
        <Formik
          initialValues={{
            email: "",
            password: ""
          }}
          validationSchema={schema}
          onSubmit={values => {
            signIn(values)
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
              <Field name="password">
                {({ field, meta: { touched, error }, }: FieldProps) => (
                  <>
                    <p className="text-sm font-semibold px-1 flex justify-between">
                      <span>Password</span>
                      {touched && Boolean(error) && <span className="text-error font-normal">Required*</span>}
                    </p>
                    <StyledInputBase
                      {...field}
                      placeholder="Password"
                      fullWidth
                      type="password"
                      error={touched && Boolean(error)}
                    />
                  </>
                )}
              </Field>
              <div className="my-2 pb-4"></div>
              <Button type="submit" variant="fill-accent" size="large" fullWidth thick>
                {loading ? <CircularProgress color="secondary" size={20} thickness={5} /> : <span>Sign in &#8594;</span>}
              </Button>
              {error ? (
                <div className="text-error mt-4 text-center text-sm">{error.response?.data.message}</div>
              ) : null}
            </form>
          )}
        </Formik>
      </div>
      <div className="max-w-sm m-auto bg-bg rounded-b-2xl rounded-t-lg px-10 py-3 mt-0.5 flex">
        <span className="text-sm mt-0.5 flex flex-1">Don't have an account?</span>
        <Button type="button" onClick={() => navigate("/signup")} variant="text-accent" size="regular">
          <span>Sign up &#8594;</span>
        </Button>
      </div>
    </>
  )
}

export default Authenticate;