import React, { useEffect, useState } from 'react';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import Button from "src/components/button/text.button";
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import * as Yup from 'yup';
import { Field, FieldProps, Form, Formik } from 'formik';
import { StyledInputBase } from 'src/components/input';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQuery } from 'src/utils/axios-hooks';
import projectAPI from 'src/apis/project'
import { addProjectAction } from 'src/store/organisation/action';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ANSWER_TYPES, IOrganisation, IOrganisationType, IProject, IProjectTemplate, IQuestion, IQuestionInput, ISelectedOrganisation } from 'src/store/organisation/type';
import InputLabel from '@material-ui/core/InputLabel';
import Radio from '@material-ui/core/Radio';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import organisationAPI from 'src/apis/organisation';
import { IState } from 'src/store/config';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { useNavigate } from 'react-router';
import AuthComponent from 'src/components/auth/auth.component';
import { UserRole } from 'src/store/auth/type';

interface IProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAddProject: (project: IProject) => void;
  selectedOrganisation: IOrganisation
}

const testQuestions: IQuestion[] = [{
  question: "Project name",
  answerType: ANSWER_TYPES.TEXT,
  required: true,
  expectedAnswer: '',
  options: [''],
  errorMessage: 'Required'
},
{
  question: "Highlight Film",
  answerType: ANSWER_TYPES.RADIO,
  required: true,
  expectedAnswer: '',
  options: ['I do not need a highlight', 'Up to 5 minutes', '5 to 7 minutes', '7 to 9 minutes'],
  errorMessage: 'Required'
},
{
  question: "Studio Name",
  answerType: ANSWER_TYPES.TEXT,
  required: true,
  expectedAnswer: '',
  options: [''],
  errorMessage: 'Required'
},
{
  question: "Some random question",
  answerType: ANSWER_TYPES.TEXT,
  required: true,
  expectedAnswer: '',
  options: [''],
  errorMessage: 'Required'
},
{
  question: "Project name",
  answerType: ANSWER_TYPES.TEXT,
  required: true,
  expectedAnswer: '',
  options: [''],
  errorMessage: 'Required'
},
]

const CreateProjectDialog: React.FC<IProps> = (props) => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { user } = useSelector((state: IState) => state.authReducer);
  const [templates, setTemplates] = useState<IProjectTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<IProjectTemplate | undefined>();

  const { mutate: createProject, loading: projectCreating } = useMutation<any, any>(projectAPI.createProject, {
    onSuccess: (res) => {
      props.onAddProject(res.data.project);
      handleDialogueClose();
    }
  });

  const { query: getProjectTemplates, loading: templatesLoading } = useQuery<any, any>(organisationAPI.getProjectTemplates, {
    onSuccess: ({ data }) => {
      setTemplates(data.projectTemplates)
      // data.projectTemplates.length && setSelectedTemplate(data.projectTemplates[0])
    }
  });


  useEffect(() => {
    if (props.open && user) {
      getProjectTemplates({
        organisation: props.selectedOrganisation._id
      })
    }
  }, [props.open])

  const getFormattedQuestions = (questions: IQuestion[]) => {
    let _questions: IQuestionInput[] = [];
    questions.forEach((question, index) => {
      _questions.push({
        question: question.question,
        answerType: question.answerType,
        answer: ""
      })
    })
    return _questions
  }

  const handleDialogueClose = () => {
    setSelectedTemplate(undefined)
    props.setOpen(false)
  };

  const createProjectSchema = Yup.object().shape({
    name: Yup.string().required(),
    template: Yup.string().required()
  });

  const validateAnswer = (value: any, required: boolean, expected?: string) => {
    let error;
    if (required) {
      if (expected === "TRUE" && !value) {
        error = "Error"
      }
      if (expected === "FALSE" && value) {
        error = "Error"
      }
      if (expected === "TEXT" && !value) {
        error = "Error"
      }
      if (expected === "YES" && value !== "YES") {
        error = "Error"
      }
      if (expected === "NO" && value !== "NO") {
        error = "Error"
      }
    }
    return error;
  }

  return (
    <Dialog
      open={props.open}
      onClose={handleDialogueClose}
      scroll="body"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >

      <div className="bg-bg-dark text-primary rounded-xl overflow-hidden">
        <div className="bg-bg-light" style={{ width: 560 }}>
          <DialogTitle className="text-base font-bold border-b border-bg-dark" style={{ padding: "0.75rem 1.75rem" }}>
            <span className="flex justify-between">
              <span>New project</span>
              <IconButton onClick={handleDialogueClose} edge="end" aria-label="options" size="small" color="secondary">
                <CloseRoundedIcon style={{ fontSize: 16 }} />
              </IconButton>
            </span>
          </DialogTitle>
          {(templatesLoading) ?
            <div className="pl-3 mt-2 h-20 flex items-center justify-center">
              <CircularProgress color="secondary" size={20} thickness={5} />
            </div>
            :
            <Formik
              initialValues={{ name: "", template: selectedTemplate?._id, questions: getFormattedQuestions(selectedTemplate?.questions || []) }}
              validationSchema={createProjectSchema}
              onSubmit={(values) => {
                createProject({
                  organisation: props.selectedOrganisation._id,
                  data: values
                })
              }}
            >
              {(formikProps) => (
                <Form>
                  <DialogContent style={{ padding: "1.5rem", overflowY: "auto" }}>
                    <div className="flex">
                      <Field name="name">
                        {({ field, meta: { touched, error }, }: FieldProps) => (
                          <div className="flex flex-col flex-1">
                            <p className="text-sm px-1 font-semibold flex justify-between">
                              <span>Project Name*</span>
                              {touched && Boolean(error) && <span className="text-error font-normal">Required*</span>}
                            </p>
                            <StyledInputBase
                              {...field}
                              placeholder="Enter Project name here"
                              fullWidth
                              error={touched && Boolean(error)}
                            />
                          </div>
                        )}
                      </Field>
                      <span className="px-1" />
                      <Field name="template">
                        {({ field, meta: { touched, error }, }: FieldProps) => (
                          <div className="flex flex-col flex-1">
                            <p className="text-sm px-1 font-semibold flex justify-between">
                              <span>Project Type*</span>
                              {touched && Boolean(error) && <span className="text-error font-normal">Required*</span>}
                            </p>
                            <Select
                              {...field}
                              fullWidth
                              value={selectedTemplate?._id}
                              input={<StyledInputBase />}
                              error={touched && Boolean(error)}
                              onChange={(event) => {
                                formikProps.setFieldValue("template", event.target.value);
                                const _template = templates.find((item) => item._id === event.target.value);
                                if (_template) {
                                  formikProps.setFieldValue("questions", getFormattedQuestions(_template.questions))
                                  setSelectedTemplate(_template);
                                }
                              }}
                            >
                              {templates.map((template) => (
                                <MenuItem value={template._id}>
                                  {template.name}
                                </MenuItem>
                              ))}
                              <AuthComponent allowedRoles={[UserRole.ADMIN, UserRole.PROJECT_MANAGER]} organisationType={IOrganisationType.EDITING}>
                                <MenuItem className="border-t border-bg">
                                  <div
                                    onClick={() => {
                                      props.setOpen(false)
                                      navigate("home/org-setup")
                                    }}
                                    className="-mx-2 -my-1 flex flex-1 border-t border-bg"
                                  >
                                    <Button type="button" variant="text-accent" size="medium" fullWidth>New template +</Button>
                                  </div>
                                </MenuItem>
                              </AuthComponent>
                            </Select>
                          </div>
                        )}
                      </Field>
                    </div>
                    <div className="mt-4 mb-2 border-b border-bg" />
                    {selectedTemplate && selectedTemplate.questions.map((question, questionIndex) => {
                      switch (question.answerType) {
                        case ANSWER_TYPES.RADIO:
                          return (
                            <>
                              <p className="text-sm px-1 font-bold flex justify-between mt-4 mb-1">
                                <span>{`${question.question} ${question.required ? "*" : ""}`}</span>
                                {/* {touched && Boolean(error) && <span className="text-error font-normal">Required*</span>} */}
                              </p>
                              {question.options?.map((option, index) => (
                                <InputLabel style={{ color: "inherit" }}>
                                  <div className="flex items-center cursor-pointer">
                                    <Field type="radio" name={`questions[${questionIndex}].answer`} value={option} >
                                      {({ field }: FieldProps) => (
                                        <Radio
                                          {...field}
                                          checked={field.checked}
                                          icon={<RadioButtonUncheckedIcon fontSize="small" style={{ color: "var(--grey-2)" }} />}
                                          checkedIcon={<RadioButtonCheckedIcon fontSize="small" />}
                                          color="primary"
                                        />
                                      )}
                                    </Field>
                                    <div className="flex flex-1 items-center pl-1 text-sm">
                                      {option}
                                    </div>
                                  </div>
                                </InputLabel>
                              ))}
                            </>
                          )
                        case ANSWER_TYPES.TEXT:
                          return (
                            <Field name={`questions[${questionIndex}].answer`} validate={(value: any) => validateAnswer(value, question.required, 'TEXT')}>
                              {({ field, meta: { touched, error }, }: FieldProps) => (
                                <>
                                  <p className="text-sm px-1 font-bold flex justify-between mt-4">
                                    <span>{`${question.question} ${question.required ? "*" : ""}`}</span>
                                    {touched && Boolean(error) && <span className="text-error font-normal">Required*</span>}
                                  </p>
                                  <StyledInputBase
                                    {...field}
                                    placeholder="Type here"
                                    fullWidth
                                    error={touched && Boolean(error)}
                                  />
                                </>
                              )}
                            </Field>
                          )
                      }
                    })}
                  </DialogContent>
                  <DialogActions style={{ padding: "0.75rem 1.5rem 1.5rem 1.5rem" }}>
                    <div className="w-full">
                      <Button type="submit" size="large" variant="fill-accent" fullWidth >
                        {projectCreating ? <CircularProgress color="secondary" size={20} thickness={5} /> : <strong className="text-sm">Create &#8594;</strong>}
                      </Button>
                    </div>
                  </DialogActions>
                </Form>

              )}
            </Formik >
          }
        </div>
      </div>
    </Dialog >
  )
};

export default CreateProjectDialog;
