import React, { useEffect, useRef, useState } from "react";
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";
import "video.js/dist/video-js.css";
import VideoControls from './video-controls';
import Buttom from "src/components/button/text.button"
import IconButton from '@material-ui/core/IconButton';
import ArrowBackRoundedIcon from '@material-ui/icons/ArrowBackRounded';
import Timeline from './timeline'
import { useNavigate } from 'react-router-dom';
import CommentBox from './comment-box';
import Popover from '@material-ui/core/Popover';
import { IProjectTask, TaskStatus } from 'src/store/organisation/type';
import { IVideo } from 'src/store/player/type';
import projectAPI from 'src/apis/project'
import { useMutation } from 'src/utils/axios-hooks';
import { taskStatusMap } from 'src/utils/consts';

import "videojs-contrib-quality-levels";

interface Props {
  dimentions: number[];
  video: IVideo;
  organisation: string;
  projectTask: IProjectTask;
}

export const VideoJS = (props: Props) => {
  const navigate = useNavigate()
  const videoRef = useRef(null);
  const playerRef = useRef<VideoJsPlayer | null>(null);
  const [metaLoaded, setMetaLoaded] = useState<boolean>(false);
  const [popoverState, setPopoverState] = useState<any>(null);
  const [taskStatus, setTaskStatus] = useState<TaskStatus>(props.projectTask.status);

  const { mutate: updateTaskStatus } = useMutation<any, any>(projectAPI.updateTaskStatus);

  const handleClick = (e: any) => {
    setPopoverState(e.currentTarget);
  };

  const handleClose = () => {
    setPopoverState(null);
  };
  const open = Boolean(popoverState);

  const videoJsOptions: VideoJsPlayerOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    muted: false,
    defaultVolume: 1,
    playbackRates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
    controlBar: {
      pictureInPictureToggle: false,
    },
    userActions: {
      doubleClick: false,
      hotkeys: true
    },
    bigPlayButton: false,
    inactivityTimeout: 0,
    sources: [{
      src: props.video.file,
      type: 'application/x-mpegURL'
    }],
    html5: {
      vhs: {
        overrideNative: true
      },
      nativeAudioTracks: false,
      nativeVideoTracks: false
    }
  }

  const handleVideoReady = (player: VideoJsPlayer) => {
    videojs.log('player is ready');
    const controlBar = document.getElementsByClassName("vjs-control-bar");
    controlBar[0] && controlBar[0].classList.add("hidden");

    const qualityLevels = player.qualityLevels();
    qualityLevels.on('addqualitylevel', function (event) {
      let qualityLevel = event.qualityLevel;
      if (qualityLevel.height >= 720) {
        qualityLevel.enabled = true;
      } else {
        qualityLevel.enabled = false;
      }
    });

    // Listen to change events for when the player selects a new quality level
    qualityLevels.on('change', function () {
      console.log('Quality Level changed!');
      console.log('New level:', qualityLevels[qualityLevels.selectedIndex]);
    });
  }

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (!videoElement) return;
      const player = playerRef.current = videojs(videoElement, videoJsOptions, () => {
        handleVideoReady(player);
      });
    }
    if (playerRef.current) {
      handleVideoReady(playerRef.current);
    }
  }, [videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  useEffect(() => {
    if (taskStatus && taskStatus !== props.projectTask.status) {
      updateTaskStatus({
        organisation: props.organisation,
        project: props.projectTask.project,
        task: props.projectTask._id,
        data: { status: taskStatus }
      });
    }
  }, [taskStatus, props.projectTask]);

  return (
    <>
      <div className="flex flex-col flex-1 justify-center items-center">
        <div className="bg-bg relative mb-12" style={{ width: `${props.dimentions[0]}rem`, height: `${props.dimentions[1]}rem` }}>
          <div className="absolute -top-12 inset-x-0 h-12 flex flex-col bg-accent rounded-t-xl border-b border-bg-dark" style={{ background: "var(--accent-shade)" }}>
            <div className="px-4 h-full flex items-center">
              <IconButton onClick={() => navigate(-1)} aria-label="delete" size="small" color="secondary" edge="start">
                <ArrowBackRoundedIcon fontSize="default" />
              </IconButton>
              <span className="text-sm font-semibold ml-3">{props.video.name}</span>
              <div className="flex flex-1 justify-end text-sm ">
                <Buttom onClick={(e) => handleClick(e)} type="button" size="regular" variant="text-white" >
                  <span className='flex items-center text-sm' style={{ color: taskStatusMap[taskStatus].color || "initial" }}>
                    {taskStatusMap[taskStatus].icon || null}
                    <span className="ml-1 text-primary">{taskStatusMap[taskStatus].label || ""}</span>
                  </span>
                </Buttom>
              </div>
              <Popover
                id={"APP_HEADER_POPOVER"}
                open={open}
                anchorEl={popoverState}
                onClose={handleClose}
                elevation={8}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <div className="bg-bg-dark text-primary rounded-xl overflow-hidden">
                  <div className="bg-bg-light">
                    <div className="bg-bg-light w-40">
                      {Object.keys(taskStatusMap).map((key, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setTaskStatus(key as TaskStatus);
                            handleClose();
                          }}
                          className={`py-3 px-4 border-b border-bg-dark text-sm cursor-pointer hover:bg-bg flex items-center`}
                          style={{ color: taskStatusMap[key as TaskStatus].color }}
                        >
                          {taskStatusMap[key as TaskStatus].icon}
                          <span className="ml-1 text-primary">{taskStatusMap[key as TaskStatus].label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </Popover>
            </div>
          </div>
          <div className="w-full h-full overflow-hidden">
            <div data-vjs-player>
              <video onLoadedMetadata={() => setMetaLoaded(true)} ref={videoRef} className="video-js vjs-big-play-centered" />
            </div>
          </div>
          <div className="absolute -bottom-18 inset-x-0 flex flex-col bg-bg rounded-b-xl border-t border-bg-dark">
            {playerRef.current && metaLoaded && (
              <>
                <Timeline player={playerRef} dimentions={props.dimentions} />
                <VideoControls player={playerRef} />
              </>
            )}
          </div>
        </div>
      </div>
      <div className="h-24 flex justify-center mt-6 pt-2">
        <div className="h-full bg-bg-light w-full">
          {playerRef.current && metaLoaded && <CommentBox videoId={props.video._id} player={playerRef} />}
        </div>
      </div>
    </>
  );
}
export default React.memo(VideoJS);