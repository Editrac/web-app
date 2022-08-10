import IconButton from '@material-ui/core/IconButton';
import React, { MutableRefObject, useEffect, useMemo, useRef, useState, MouseEvent } from "react";
import "video.js/dist/video-js.css";
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import PauseRoundedIcon from '@material-ui/icons/PauseRounded';
import VolumeUpRoundedIcon from '@material-ui/icons/VolumeUpRounded';
import VolumeOffRoundedIcon from '@material-ui/icons/VolumeOffRounded';
import FullscreenOutlinedIcon from '@material-ui/icons/FullscreenOutlined';
import VolumeDownRoundedIcon from '@material-ui/icons/VolumeDownRounded';
import Replay10RoundedIcon from '@material-ui/icons/Replay10Rounded';
import Forward10RoundedIcon from '@material-ui/icons/Forward10Rounded';
import { useSelector } from 'react-redux';
import { IState } from 'src/store/config';
import { VideoJsPlayer } from 'video.js';
import Popover from '@material-ui/core/Popover';
import { StyledSlider } from 'src/components/input';
import styles from "./index.module.css";

interface Props {
  player: MutableRefObject<VideoJsPlayer | null>
}

export const VideoControls = (props: Props) => {
  const timestamp = useSelector((state: IState) => state.playerReducer.timestamp);
  const { player } = props;
  const controls = useMemo(() => {
    return {
      paused: player?.current?.paused(),
      muted: player?.current?.muted(),
      fullScreen: false
    }
  }, [])
  const [paused, setPaused] = useState<boolean | undefined>(player?.current?.paused());
  const [volume, setVolume] = useState<number>(player?.current?.volume() || 0);
  const [state, setState] = useState<boolean>(false);
  const [speedPOState, setSpeedPOState] = useState<{ anchorEl: HTMLButtonElement | null, rate: number }>({ anchorEl: null, rate: 1 });
  const handleSpeedClick = (e: MouseEvent<HTMLButtonElement>) => {
    setSpeedPOState({ ...speedPOState, anchorEl: e.currentTarget });
  };
  const handleSpeedPOClose = () => {
    setSpeedPOState({ ...speedPOState, anchorEl: null });
  };
  const speedPOOpen = Boolean(speedPOState.anchorEl);

  useEffect(() => {
    if (timestamp >= 0) {
      player?.current?.currentTime(timestamp);
    }
  }, [timestamp])

  const handlePlayPause = () => {
    if (controls.paused) {
      player?.current?.play()
    } else {
      player?.current?.pause();
    }
  }

  const handleMute = () => {
    if (!volume) {
      player?.current?.muted(false);
      player?.current?.volume(0.5);
      setVolume(0.5);
    } else {
      player?.current?.muted(true);
      setVolume(0);
    }
  }

  const handlePlayBackSpeed = (rate: number) => {
    player?.current?.playbackRate(rate);
    setSpeedPOState({ rate, anchorEl: null });
  }

  const handleVolumeChange = (volume: number) => {
    player?.current?.volume(volume);
    setVolume(volume)
  }

  const seek10Sec = (direction: string) => {
    direction === "FORWARD" ? player?.current?.currentTime(player?.current?.currentTime() + 10) : player?.current?.currentTime(player.current.currentTime() - 10);
    setState(!state);
  }
  const fullScreen = () => {
    player?.current?.requestFullscreen();
  }

  player?.current?.on('fullscreenchange', () => {
    if (controls.fullScreen) {
      const controlBar = document.getElementsByClassName("vjs-control-bar");
      controlBar[0].classList.add("hidden");
      controls.fullScreen = false
    }
    else {
      const controlBar = document.getElementsByClassName("vjs-control-bar");
      controlBar[0].classList.remove("hidden");
      controls.fullScreen = true
    }
  });

  player?.current?.on('ended', () => {
    if (!controls.paused) {
      controls.paused = true;
      setPaused(controls.paused);
    }
  });
  player?.current?.on('play', () => {
    if (controls.paused) {
      controls.paused = false;
      setPaused(controls.paused);
    }

  });
  player?.current?.on('pause', () => {
    if (!controls.paused) {
      controls.paused = true;
      setPaused(controls.paused);
    }
  });

  return (
    <>
      <div className="h-10 flex items-center border-t border-grey-0 border-dashed px-2">
        <Popover
          id="SPEED_CONTROL_POPOVER"
          open={speedPOOpen}
          anchorEl={speedPOState.anchorEl}
          onClose={handleSpeedPOClose}
          elevation={8}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <p className="pt-3 px-4 bg-bg text-xs font-bold text-white">Playback Speed</p>
          <div className="px-2 py-2 bg-bg flex items-center">
            {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speed, index) => (
              <div className="mx-2" key={index}>
                <IconButton onClick={() => handlePlayBackSpeed(speed)} aria-label="delete" size="small" color="secondary">
                  <div className={`w-6 h-6 flex items-center justify-center text-xs ${speedPOState.rate === speed ? "underline font-bold" : ""}`}>{speed}x</div>
                </IconButton>
              </div>
            ))}
          </div>
        </Popover>
        <div>
          <IconButton onClick={() => seek10Sec("BACKWARD")} aria-label="delete" size="small" color="secondary">
            <Replay10RoundedIcon style={{ fontSize: 20 }} />
          </IconButton>
        </div>
        <div className="ml-1">
          <IconButton onClick={handlePlayPause} aria-label="delete" size="small" color="secondary">
            {paused ? <PlayArrowRoundedIcon style={{ fontSize: 28 }} /> : <PauseRoundedIcon style={{ fontSize: 28 }} />}
          </IconButton>
        </div>
        <div className="ml-1">
          <IconButton onClick={() => seek10Sec("FORWARD")} aria-label="delete" size="small" color="secondary">
            <Forward10RoundedIcon style={{ fontSize: 20 }} />
          </IconButton>
        </div>
        <div className={`${styles.volumeConrolWrap} ml-2 flex items-center`}>
          <IconButton onClick={handleMute} aria-label="delete" size="small" color="secondary">
            {!volume ? <VolumeOffRoundedIcon style={{ fontSize: 20 }} /> : <VolumeUpRoundedIcon style={{ fontSize: 22 }} />}
          </IconButton>
          <div className={`${styles.volumeSlider} flex items-center ml-1`}>
            <StyledSlider onChange={(e, volume: any) => handleVolumeChange(volume)} value={volume} aria-label="pretto slider" defaultValue={1} max={1} min={0} step={0.05} />
          </div>
        </div>
        <div className="flex flex-1"></div>
        <div className="ml-1">
          <IconButton onClick={handleSpeedClick} aria-label="delete" size="small" color="secondary">
            <div className="w-6 h-6 flex items-center justify-center text-sm font-semibold">{speedPOState.rate}x</div>
          </IconButton>
        </div>
        <span className="px-1" />
        <div className="ml-1">
          <IconButton onClick={fullScreen} aria-label="delete" size="small" color="secondary">
            <FullscreenOutlinedIcon style={{ fontSize: 24 }} />
          </IconButton>
        </div>
      </div>
    </>
  );
}
export default VideoControls;