import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import Button from 'src/components/button/text.button';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';
import { useMutation } from 'src/utils/axios-hooks';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';
import { IState } from 'src/store/config';
import { StyledInputBase } from 'src/components/input';
import { Field, FieldProps, Form, Formik } from 'formik';
import { useDropzone } from 'react-dropzone';
import organisationAPI from 'src/apis/organisation';
import { IOrganisation } from 'src/store/organisation/type';
import { updateUserAction } from 'src/store/auth/action';
import { IUser } from 'src/store/auth/type';
import { useSnackbar, SnackBarVariant } from 'src/utils/snackbar';

interface IProps {
  user: IUser
}

const BasicSettings: React.FC<IProps> = (props) => {
  const snackbar = useSnackbar();
  const dispatch = useDispatch();
  const { _e_ } = useSelector((state: IState) => state.authReducer);
  const [imageKey, setImageKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { mutate: updateOrganisation } = useMutation<any, any>(organisationAPI.updateOrganisation, {
    onSuccess: ({ data }, variables) => {
      setLoading(false);
      snackbar({
        variant: SnackBarVariant.SUCCESS,
        visible: true,
        message: 'Organisation updated!',
      });
      dispatch(updateUserAction({
        user: {
          ...props.user,
          organisation: {
            ...props.user.organisation,
            ...data.organisation
          }
        }
      }));
    }
  });

  const onDrop = useCallback((files: File[]) => {
    if (_e_) {
      const client = _e_;
      const filePromises = [];
      if (files) {
        for (var i = 0; i < files.length; i++) {
          const name = files[i].name;
          const lastDot = name.lastIndexOf('.');
          const ext = name.substring(lastDot + 1);
          const file = `${uuidv4()}.${ext}`;
          const promise = client
            .add({
              name: file,
              file: files[i],
              started: function (fileKey) {
                setImageKey(fileKey);
                setLoading(true)
              },
              progress: function (progress) {
                if (progress === 1) {
                  updateOrganisation({
                    organisation: props.user.organisation._id,
                    data: {
                      organisationName: props.user.organisation.name,
                      picture: file
                    }
                  });
                  setImageKey(file);
                }
              }
            });
          filePromises.push(promise);
        }
        Promise.all(filePromises).catch((err) => console.log(err));
      }
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

  const schema = Yup.object().shape({
    organisationName: Yup.string().required(),
  });

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          organisationName: props.user.organisation.name,
        }}
        validationSchema={schema}
        onSubmit={(values) => {
          const updates = imageKey ? { organisationName: values.organisationName, picture: imageKey } : { organisationName: values.organisationName }
          updateOrganisation({
            organisation: props.user.organisation._id,
            data: updates
          });
        }}
      >
        {(formikProps) => (
          <Form className="max-w-sm mt-10 mx-auto">
            <div className="w-32 mt-4 text-center">
              <div className="w-32 h-32 border-2 border-dashed border-bg rounded-xl overflow-hidden">
                {loading ?
                  <div className="w-full h-full flex items-center justify-center">
                    <CircularProgress color="secondary" size={20} thickness={5} />
                  </div>
                  : <div className="w-full h-full">
                    {props.user.organisation.picture ?
                      <img src={props.user.organisation.picture} className="h-full w-full object-contain" /> :
                      <div className="h-full w-full flex items-center justify-center text-base font-bold">
                        <span>{props.user.organisation.name.slice(0, 2)}</span>
                      </div>
                    }
                  </div>}
              </div>
              <Button type="button" variant="text-accent" size="medium" fullWidth>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p className="text-sm font-semibold">{props.user.organisation.picture ? "Change Image" : "Upload Image"}</p>
                </div>
              </Button>
            </div>
            <div className="mt-2">
              <Field name="organisationName">
                {({ field, meta: { touched, error }, }: FieldProps) => (
                  <StyledInputBase
                    {...field}
                    placeholder="Organisation Name"
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
          </Form>
        )}
      </Formik>
    </>
  );
};

export default BasicSettings;

