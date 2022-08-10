import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import Button from 'src/components/button/text.button';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import EditIcon from '@material-ui/icons/Edit';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';
import ClearIcon from '@material-ui/icons/Clear';
import * as Yup from 'yup';
import { useMutation, useQuery } from 'src/utils/axios-hooks';
import CircularProgress from '@material-ui/core/CircularProgress';
import { StyledInputBase, StyledSwitch } from 'src/components/input';
import { Field, FieldArray, FieldProps, Form, Formik } from 'formik';
import organisationAPI from 'src/apis/organisation';
import { ANSWER_TYPES, IOrganisation, IProjectTemplate, IQuestion } from 'src/store/organisation/type';
import { updateUserAction } from 'src/store/auth/action';
import { IUser } from 'src/store/auth/type';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Collapse from '@material-ui/core/Collapse';
import { useSnackbar, SnackBarVariant } from 'src/utils/snackbar';

interface IProps {
  user: IUser
}

const initialQuestionData: IQuestion = {
  question: '',
  answerType: ANSWER_TYPES.TEXT,
  required: false,
  expectedAnswer: 'YES',
  options: [],
  errorMessage: ''
}

const ProjectQuestions: React.FC<IProps> = (props) => {
  const snackbar = useSnackbar()
  const [templates, setTemplates] = useState<IProjectTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<IProjectTemplate>();
  const [dialogue, setDialogue] = useState<{ open: boolean, data: IQuestion, questionIndex?: number }>({
    open: false,
    data: initialQuestionData
  });
  const { query: getProjectTemplates, loading: templatesLoading } = useQuery<any, any>(organisationAPI.getProjectTemplates, {
    onSuccess: ({ data }) => {
      setTemplates(data.projectTemplates)
    }
  });

  const { mutate: createProjectTemplate, loading: creatingTemplate } = useMutation<any, any>(organisationAPI.createProjectTemplate, {
    onSuccess: ({ data }) => {
      let _templates = templates;
      _templates.push(data.projectTemplate)
      setTemplates(_templates);
      setSelectedTemplate(data.projectTemplate)
      snackbar({
        visible: true,
        variant: SnackBarVariant.SUCCESS,
        message: "Template created!"
      })
    },
    onError: (err) => {
      snackbar({
        visible: true,
        variant: SnackBarVariant.ERROR,
        message: err.message
      })
    }
  });

  const { mutate: updateProjectTemplate, loading: updatingTemplate } = useMutation<any, any>(organisationAPI.updateProjectTemplate, {
    onSuccess: ({ data }) => {
      setSelectedTemplate(data.projectTemplate);
      snackbar({
        visible: true,
        variant: SnackBarVariant.SUCCESS,
        message: "Template Updated!"
      })
    },
    onError: (err) => {
      snackbar({
        visible: true,
        variant: SnackBarVariant.ERROR,
        message: err.message
      })
    }
  });

  useEffect(() => {
    getProjectTemplates({
      organisation: props.user.organisation._id
    })
  }, [])

  const handleDialogueClose = () => {
    setDialogue({
      ...dialogue,
      open: false,
    });
  };

  const schema = Yup.object().shape({
    name: Yup.string().required(),
    questions: Yup.array().min(1)
  });

  const questionsSchema = Yup.object().shape({
    question: Yup.string().required("Question is required"),
    errorMessage: Yup.string().when('required', {
      is: true,
      then: Yup.string().required('Error message is required'),
    }),
    options: Yup.array()
      .when('answerType', {
        is: ANSWER_TYPES.RADIO,
        then: Yup.array()
          .of(
            Yup.string().required()
          )
          .min(1)
      })
  });


  return (
    <div>
      {templatesLoading ?
        <div className="py-2 px-5">
          <CircularProgress color="secondary" size={20} thickness={5} />
        </div>
        : <div className="text-sm border-b border-bg mb-4 flex py-2 px-5 flex-wrap">
          {templates.map((template, index) => (
            <div onClick={() => setSelectedTemplate(template)} className={`h-10 px-3 m-1 flex items-center rounded-md border text-sm font-semibold cursor-pointer ${template._id === selectedTemplate?._id ? "border-accent bg-bg" : "border-grey-1"}`}>{template.name}</div>
          ))}
          <div onClick={() => setSelectedTemplate({ name: "", questions: [] })} className="h-10 px-3 m-1 flex items-center rounded-md border border-dashed border-grey-1 text-accent text-sm font-semibold cursor-pointer hover:bg-bg">Create New +</div>
        </div>
      }
      {selectedTemplate && <Formik
        enableReinitialize
        initialValues={{
          name: selectedTemplate.name,
          questions: selectedTemplate.questions,
        }}
        validationSchema={schema}
        onSubmit={(values) => {
          if (selectedTemplate._id) {
            updateProjectTemplate({
              organisation: props.user.organisation._id,
              template: selectedTemplate._id,
              data: {
                name: values.name,
                questions: values.questions
              }
            })
          }
          else {
            createProjectTemplate({
              organisation: props.user.organisation._id,
              data: values
            })
          }
        }}
      >
        {(formikProps) => (
          <Form className="mt-6 px-6">
            <Field
              name="name"
            >
              {({ field, meta: { touched, error }, }: FieldProps) => (
                <>
                  <p className="text-sm px-1 font-bold flex justify-between mt-4">
                    <span>Template Name*</span>
                    {touched && Boolean(error) && <span className="text-error font-normal">Required*</span>}
                  </p>
                  <StyledInputBase
                    {...field}
                    placeholder="Enter template name"
                    fullWidth
                    error={touched && Boolean(error)}
                  />
                </>
              )}
            </Field>
            <p className="mb-1.5 mt-4 px-1 text-sm font-bold flex justify-between">
              <span>Questions</span>
              <span className='text-error font-normal'>{formikProps.touched.questions && Boolean(formikProps.errors.questions) ? "Add at least one question" : ""}</span>
            </p>
            <div className={`p-4 border border-dashed ${formikProps.touched.questions && Boolean(formikProps.errors.questions) ? "border-error" : " border-grey-1"} rounded-xl`}>
              {formikProps.values.questions.length ? formikProps.values.questions.map((question: IQuestion, index: number) => (
                <div className="py-4 relative rounded-xl overflow-hidden group">
                  {question.answerType === ANSWER_TYPES.RADIO &&
                    <div className="opacity-50">
                      <p className="text-sm font-bold mb-2">{question.question}{question.required && '*'}</p>
                      {question.options?.map((option, index) => (
                        <div className="flex items-center text-sm py-1">
                          <RadioButtonUncheckedIcon fontSize="small" />
                          <span className="ml-2">{option}</span>
                        </div>
                      ))}
                    </div>
                  }
                  {question.answerType === ANSWER_TYPES.TEXT &&
                    <div className="opacity-50">
                      <p className="text-sm font-bold mb-2">{question.question}{question.required && '*'}</p>
                      <div className="bg-bg border border-bg rounded-lg w-full h-10"></div>
                    </div>
                  }
                  <div className="absolute inset-0 z-10 flex items-center justify-end opacity-0 group-hover:opacity-100" style={{ background: "linear-gradient(90deg, rgba(19,19,24,0) 10%, rgb(19,19,24) 78%)" }}>
                    <div className="h-9 flex w-16 rounded-lg overflow-hidden bg-bg-dark text-sm font-semibold mr-4">
                      <div onClick={() => setDialogue({ open: true, data: question, questionIndex: index })} className="flex flex-1 items-center justify-center bg-bg-light text-accent font-semibold cursor-pointer">
                        <EditIcon fontSize="inherit" />
                        <span className="ml-1">Edit</span>
                      </div>
                    </div>

                  </div>
                </div>
              )) : null}
              <div className="mt-2 mb-2 flex justify-between">
                <Button
                  variant="text-accent"
                  size="regular"
                  type="button"
                  onClick={() => setDialogue({ open: true, data: initialQuestionData, questionIndex: undefined })}
                >
                  <span className="font-semibold text-sm">Add question +</span>
                </Button>
              </div>
            </div>
            <div className="mt-6 mb-20 w-32">
              <Button
                variant="fill-accent"
                size="regular"
                fullWidth
                type="submit"
              // onClick={() => setDialogue({ open: true, data: initialQuestionData, questionIndex: undefined })}
              >
                {(updatingTemplate || creatingTemplate) ? <CircularProgress color="secondary" size={20} thickness={5} /> : <strong>Save</strong>}
              </Button>
            </div>
            <Dialog
              open={dialogue.open}
              onClose={handleDialogueClose}
              scroll="paper"
              aria-labelledby="scroll-dialog-title"
              aria-describedby="scroll-dialog-description"
            >
              <Formik
                enableReinitialize
                initialValues={dialogue.data}
                validationSchema={questionsSchema}
                onSubmit={(values, { setSubmitting }) => {
                  const tempArray: IQuestion[] = [...formikProps.values.questions];
                  if (typeof (dialogue.questionIndex) === 'number') {
                    tempArray[dialogue.questionIndex] = values;
                  }
                  else {
                    tempArray.push(values)
                  }
                  formikProps.setFieldValue('questions', tempArray);
                  handleDialogueClose();
                }}
              >
                {props => (
                  <Form className="bg-bg-dark text-primary rounded-xl overflow-hidden">
                    <div className="bg-bg-light" style={{ width: 520 }}>
                      <div className="text-sm font-bold py-3 px-7 border-b border-bg-dark flex items-center justify-between">
                        <span>{typeof (dialogue.questionIndex) === 'number' ? 'Edit' : 'Add'} question</span>
                        <IconButton onClick={handleDialogueClose} edge="end" aria-label="options" size="small" color="secondary">
                          <CloseRoundedIcon style={{ fontSize: 16 }} />
                        </IconButton>
                      </div>
                      <div className="p-6">
                        <div className="">
                          <Field name="question">
                            {({ field, meta: { touched, error }, }: FieldProps) => (
                              <>
                                <p className="text-xs px-1 font-semibold flex justify-between">
                                  <span>Question*</span>
                                  {touched && Boolean(error) && <span className="text-error font-normal">Required*</span>}
                                </p>
                                <StyledInputBase
                                  {...field}
                                  placeholder="Enter question"
                                  fullWidth
                                  error={touched && Boolean(error)}
                                />
                              </>
                            )}
                          </Field>
                          <div className="mt-4" />
                          <Field
                            name="answerType"
                          >
                            {({ field, meta: { touched, error }, }: FieldProps) => (
                              <>
                                <p className="text-xs px-1 font-semibold flex justify-between">
                                  <span>Select answer type</span>
                                  {touched && Boolean(error) && <span className="text-error font-normal">Required*</span>}
                                </p>
                                <Select
                                  {...field}
                                  fullWidth
                                  input={<StyledInputBase />}
                                  error={touched && Boolean(error)}
                                >
                                  <MenuItem value={ANSWER_TYPES.TEXT}>
                                    Text
                                  </MenuItem>
                                  <MenuItem value={ANSWER_TYPES.RADIO}>
                                    Radio options
                                  </MenuItem>
                                </Select>
                              </>
                            )}
                          </Field>
                          <div className="border border-grey-1 rounded-b-xl rounded-t-md py-4 px-3" style={{ zIndex: -1 }}>
                            <Collapse in={props.values.answerType === ANSWER_TYPES.RADIO}>
                              <div className="pb-4 mb-4 border-b border-bg">
                                <p className="text-sm font-bold">
                                  Options
                                </p>
                                <FieldArray
                                  name="options"
                                >
                                  {({ push, remove, form }) => <>
                                    {props.values.options?.map((option, index) => (
                                      <Field key={index} name={`options[${index}]`}>
                                        {({ field, meta: { touched, error }, }: FieldProps) => (
                                          <div className="flex items-center">
                                            <StyledInputBase
                                              {...field}
                                              placeholder={`Option ${index + 1} ${(touched && Boolean(error)) ? 'required*' : ''}`}
                                              fullWidth
                                              error={touched && Boolean(error)}
                                            />
                                            <span className="px-1" />
                                            <IconButton onClick={() => remove(index)} color="secondary" size="small">
                                              <ClearIcon fontSize="inherit" />
                                            </IconButton>
                                          </div>
                                        )}
                                      </Field>
                                    ))}
                                    {typeof (form.errors.options) === "string" && <p className="text-sm text-error mt-2">Add at least one option</p>}
                                    <h4
                                      className="text-sm text-accent font-semibold mt-2 cursor-pointer"
                                      onClick={() => push('')}
                                    >
                                      + Add option
                                    </h4>
                                  </>
                                  }
                                </FieldArray>
                              </div>
                            </Collapse>
                            <div className="flex items-center">
                              <Field
                                name="required"
                              >
                                {({ field, form: { setTouched, touched }, meta }: FieldProps) => (
                                  <StyledSwitch checked={field.value} {...field} />
                                )}
                              </Field>
                              <h4 className="text-sm font-semibold ml-2">Required</h4>
                            </div>
                            <Collapse in={props.values.required}>
                              <Field name="errorMessage">
                                {({ field, meta: { touched, error }, }: FieldProps) => (
                                  <>
                                    <p className="text-xs px-1 font-semibold flex justify-between mt-4">
                                      <span>Error message*</span>
                                      {touched && Boolean(error) && <span className="text-error font-normal">Required*</span>}
                                    </p>
                                    <StyledInputBase
                                      {...field}
                                      placeholder="Enter the error message"
                                      fullWidth
                                      error={touched && Boolean(error)}
                                    />
                                  </>
                                )}
                              </Field>
                            </Collapse>
                          </div>
                        </div>
                        <div className="mt-6 flex items-center">
                          <div className="flex flex-1">
                            {typeof (dialogue.questionIndex) === 'number' ? <Button
                              variant="text-error"
                              size="regular"
                              type="button"
                              onClick={() => {
                                const tempArray: IQuestion[] = [...formikProps.values.questions];
                                if (typeof (dialogue.questionIndex) === 'number') {
                                  tempArray.splice(dialogue.questionIndex, 1);
                                }
                                formikProps.setFieldValue('questions', tempArray);
                                handleDialogueClose();
                              }}
                            >
                              <DeleteRoundedIcon fontSize="inherit" />
                              <span className="font-semibold ml-1">Delete</span>
                            </Button> : null}
                          </div>
                          <Button
                            variant="text-white"
                            size="regular"
                            type="button"
                            onClick={handleDialogueClose}
                          >
                            Cancel
                          </Button>
                          <span className="px-1" />
                          <Button
                            variant="fill-accent"
                            size="regular"
                            type="submit"
                          >
                            <strong>Done</strong>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </Dialog>
          </Form>
        )}
      </Formik>}
    </div>
  );
};

export default ProjectQuestions;

