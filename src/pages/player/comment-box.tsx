import React, { MutableRefObject, useState } from 'react';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import * as Yup from 'yup';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import ScheduleIcon from '@material-ui/icons/Schedule';
import Buttom from "src/components/button/text.button"
import InputBase from '@material-ui/core/InputBase';
import { Field, FieldProps, Formik } from 'formik';
import { useMutation } from 'src/utils/axios-hooks';
import projectAPI from "src/apis/project"
import { useDispatch, useSelector } from 'react-redux';
import { addCommentAction } from 'src/store/player/action';
import { commentVisibility, IComment } from 'src/store/player/type';
import CircularProgress from '@material-ui/core/CircularProgress';
import { VideoJsPlayer } from 'video.js';
import { formatSeconds } from 'src/utils/time';
import { IState } from 'src/store/config';

interface IProps {
  player: MutableRefObject<VideoJsPlayer | null>;
  videoId: string;
}

const CommentBox: React.FC<IProps> = (props) => {
  const { player } = props;
  const dispatch = useDispatch();
  const { user } = useSelector((state: IState) => state.authReducer);
  const [timestamp, setTimestamp] = useState<number | undefined>(player?.current?.currentTime());
  const { mutate: addComment, loading } = useMutation<any, any>(projectAPI.addComment, {
    onSuccess: (res) => {
      const addedComment: IComment = res.data.videoComment
      dispatch(addCommentAction({ comment: addedComment }));
    }
  });

  const schema = Yup.object().shape({
    text: Yup.string().required(),
  });

  player?.current?.on('timeupdate', () => {
    setTimestamp(player?.current?.currentTime())
  });

  return (
    <Formik
      enableReinitialize
      initialValues={{
        timestamp,
        text: "",
        visibility: commentVisibility.EVERYONE
      }}
      validationSchema={schema}
      onSubmit={values => {
        addComment({
          video: props.videoId,
          data: {
            text: values.text,
            timestamp: timestamp ?? -1,
            visibility: values.visibility
          }
        })
        values.text = "";
      }}
    >
      {(formikProps) => (
        <form onSubmit={formikProps.handleSubmit} className="flex items-center h-full px-4 py-4">
          <div className="rounded-full w-8 h-8 bg-bg-light overflow-hidden">
            <img className="w-full h-full object-covert" src={user?.picture} />
          </div>
          <div
            className={`pr-2 pl-1 py-1 flex items-center rounded-md bg-bg-dark text-sm ml-4 border cursor-pointer hover:text-accent ${!!timestamp ? "text-accent border-accent" : "text-grey-2 border-grey-2"}`}
          >
            <span className="mr-1 flex items-center">
              <ScheduleIcon fontSize="inherit" color="inherit" />
              <span className="ml-1 ">{!!timestamp ? `${formatSeconds(timestamp)}` : "time"}</span>
            </span>
            {!!timestamp && <CheckCircleRoundedIcon fontSize="inherit" color="inherit" />}
          </div>
          <div className="text-sm ml-4 text-grey-5 flex flex-1 text-white">
            <Field name="text">
              {({ field, meta: { touched, error }, }: FieldProps) => (
                <InputBase
                  {...field}
                  style={{ color: "#fff", fontSize: "inherit" }}
                  placeholder="Type your comment here"
                  inputProps={{ 'aria-label': 'Type your comment here' }}
                  fullWidth
                  onFocus={() => player?.current?.pause()}
                  multiline
                  rowsMax={4}
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      formikProps.handleSubmit();
                    }
                  }}
                  onChange={(event) => {
                    formikProps.setFieldValue("text", event.target.value);
                  }}
                />
              )}
            </Field>
          </div>
          <div className="pr-1 pl-1 py-1 flex items-center rounded-md bg-bg-dark text-sm ml-4 mr-2 border border-accent">
            <span className="ml-1">Everyone</span>
            <ExpandMoreRoundedIcon fontSize="inherit" />
          </div>
          <Buttom type="submit" size="regular" variant="fill-accent" title="Send">
            {loading ? <CircularProgress color="secondary" size={14} thickness={4} /> : <SendRoundedIcon fontSize="inherit" />}
          </Buttom>
        </form>)}
    </Formik>
  )
};

export default CommentBox;
