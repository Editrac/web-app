import React, { useCallback, useEffect, useMemo, useState } from 'react';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import IconButton from '@material-ui/core/IconButton';
import PublishIcon from '@material-ui/icons/Publish';
import Dialog from '@material-ui/core/Dialog';
import { v4 as uuidv4 } from 'uuid';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation } from 'src/utils/axios-hooks';
import { useDropzone } from 'react-dropzone';

import { IState } from 'src/store/config';
import projectAPI from 'src/apis/project'
import { addVideoToProjectAction } from 'src/store/organisation/action';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import { IVideo } from 'src/store/player/type';
import { ProjectTaskStatus } from 'src/store/organisation/type';
import { useParams } from 'react-router-dom';
import Uppy from '@uppy/core'
import Tus from '@uppy/tus'
import { Dashboard } from '@uppy/react'

interface IProps {
  taskId: string;
  open: boolean;
  onClose: (video?: IVideo) => void
}

const VideoUploadDialog: React.FC<IProps> = (props) => {
  const dispatch = useDispatch();
  const { _e_, token } = useSelector((state: IState) => state.authReducer);
  const [videoFileKey, setVideoFileKey] = useState<string>('');
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const { orgId: selectedOrgId, projectId: selectedProjectId } = useParams<{ orgId: string, projectId: string }>();

  const { mutate: updateTaskStatus } = useMutation<any, any>(projectAPI.updateTaskStatus);

  const { mutate: addVideoToProjectTask } = useMutation<any, any>(projectAPI.addVideoToProjectTask, {
    onSuccess: ({ data }) => {
      setVideoProgress(0);
      setVideoFileKey('');
      setUploading(false);
      if (selectedOrgId) {
        updateTaskStatus({
          organisation: selectedOrgId,
          task: props.taskId,
          project: selectedProjectId,
          data: {
            status: ProjectTaskStatus.REVIEW
          }
        });
        props.onClose(data.video);
        dispatch(addVideoToProjectAction(data));
      }
    },
    onError: () => {
      setVideoProgress(0);
      setVideoFileKey('');
      setUploading(false);
    }
  });

  const handleDialogueClose = () => {
    if (videoFileKey) {
      _e_?.cancel(videoFileKey).then(() => {
        props.onClose();
      }).catch((err) => console.log(err));
    } else {
      props.onClose();
    }
    setVideoProgress(0);
    setVideoFileKey('');
    setUploading(false);
  };

  const onDrop = useCallback((files: File[]) => {
    setUploading(true);
    console.log(_e_, selectedOrgId)
    if (_e_ && selectedOrgId && selectedProjectId) {
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
              started: (fileKey) => {
                setVideoFileKey(fileKey);
              },
              progress: (progress) => {
                setVideoProgress(Math.round(progress * 100));
              },
              complete: () => {
                addVideoToProjectTask({
                  organisation: selectedOrgId,
                  task: props.taskId,
                  project: selectedProjectId,
                  data: {
                    file,
                    name
                  }
                })
              }
            });
          filePromises.push(promise);
        }
        Promise.all(filePromises).catch((err) => console.log(err));
      }
    }
  }, [])

  const uppy = useMemo(() => {
    let streamMediaId: string;
    return new Uppy({
      meta: { type: 'avatar' },
      restrictions: { maxNumberOfFiles: 1, allowedFileTypes: ['video/*'] },
      autoProceed: true,
    })
      .use(Tus, {
        endpoint: `${process.env.REACT_APP_API_URL}/api/cloudflare/signer`,
        removeFingerprintOnSuccess: true,
        headers: {
          'Upload-Metadata': 'requiresignedurls'
        },
        onAfterResponse(_, res) {
          return new Promise<void>(resolve => {
            streamMediaId = res.getHeader('stream-media-id');
            return resolve();
          });
        },
      })
      .on('complete', (result) => {
        if (result.successful.length) {
          const video = result.successful[0]
          addVideoToProjectTask({
            organisation: selectedOrgId,
            task: props.taskId,
            project: selectedProjectId,
            data: {
              file: streamMediaId,
              name: video.name
            }
          })
        }
      })
  }, []);

  useEffect(() => {
    return () => uppy.close()
  }, [uppy])

  return (
    <Dialog
      open={props.open}
      onClose={(_, reason) => {
        if (!reason) {
          handleDialogueClose()
        }
      }}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <div className="text-primary rounded-xl overflow-hidden">
        <Paper className="bg-bg-dark text-primary rounded-xl overflow-hidden">
          <div style={{ width: 480 }}>
            <div className="text-sm font-bold py-3 px-7 border-b border-bg-dark flex items-center justify-between text-white">
              <span>Upload video</span>
              <IconButton onClick={handleDialogueClose} edge="end" aria-label="options" size="small" color="secondary">
                <CloseRoundedIcon style={{ fontSize: 16 }} />
              </IconButton>
            </div>
            <div className="flex flex-col">
              {uploading ?
                <div className="h-32 border-2 border-dashed border-grey-1 rounded-xl m-4 cursor-pointer flex items-center justify-center flex-col">
                  <CircularProgress color="secondary" size={20} thickness={5} />
                  <p className="text-xs mt-3">Uploading...</p>
                  <div className=" w-96 bg-bg h-3 rounded-full mt-6 relative overflow-hidden">
                    <div className="bg-accent absolute inset-y-0 left-0" style={{ width: `${videoProgress}%` }} />
                  </div>
                </div>
                : (
                  <Dashboard
                    uppy={uppy}
                    height={200}
                  />
                )}
            </div>
          </div>
        </Paper>
      </div>
    </Dialog>
  )
};

export default VideoUploadDialog;
