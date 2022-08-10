import React from "react";
import Popper, { PopperProps } from '@material-ui/core/Popper';
import Tooltip from '@material-ui/core/Tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { setTimestampAction } from 'src/store/player/action';
import "video.js/dist/video-js.css";
import { IState } from 'src/store/config';
import { IComment } from 'src/store/player/type';

interface Props {
  player: any,
  dimentions: number[]
}

const ToolTipComponent = (comment: IComment, index: number) => (props: PopperProps) => {
  const minute = (comment.timestamp - (comment.timestamp % 60)) / 60;
  const second = parseInt(`${comment.timestamp % 60}`);
  return (
    <Popper {...props} transition>
      <div className="mb-2 py-3 px-4 rounded-xl text-xs" style={{ maxWidth: 300, backgroundColor: "var(--bgsolid)" }}>
        <div className="flex items-center mb-1 font-semibold">
          <div className="h-6 w-6 bg-bg-light z-0 rounded-full overflow-hidden mr-2">
            {false ?
              <img src={`${process.env.PUBLIC_URL}`} className="h-full w-full object-cover" /> :
              <div className="h-full w-full flex items-center justify-center" style={{ fontSize: 10 }}>
                <span>{comment.user.firstName[0]}{comment.user.lastName[0]}</span>
              </div>
            }
          </div>
          <span>{comment.user.firstName} {comment.user.lastName}</span>
        </div>
        <div >
          <span className="mr-2 font-semibold text-accent">{`${minute >= 10 ? minute : `0${minute}`}:${second >= 10 ? second : `0${second}`}`}</span>{comment.text}
        </div>
      </div>
    </Popper>
  )
}

export const Timeline = (props: Props) => {
  const { comments } = useSelector((state: IState) => state.playerReducer);
  const { player } = props;
  const colors = ["#00E6F0", "#00FF00", "#FFFF00", "#FF6800", "#E55151"];
  const computedFontSize = parseInt(window.getComputedStyle(document.body).fontSize.slice(0, -2));
  const dispatch = useDispatch();

  const handleThumbClick = (timestamp: number) => {
    dispatch(setTimestampAction({ timestamp }))
  }

  return (
    <div className="flex h-8 flex-col relative">
      {comments.map((comment, index) => {
        const duration = player.current.duration();
        const trackLength = props.dimentions[0] * computedFontSize;
        let position = trackLength * (comment.timestamp / duration);
        if (position < 10) {
          position = 10
        }
        if (position > trackLength - 10) {
          position = trackLength - 10
        }
        if (comment.timestamp > 0) {
          return (
            <Tooltip key={index} placement="top" PopperComponent={ToolTipComponent(comment, index)} title={comment.text}>
              <button onClick={() => handleThumbClick(comment.timestamp)} className="bg-bg-dark z-0 rounded-full overflow-hidden absolute top-1.5 cursor-pointer hover:bg-bg hover:z-10 left-0 opacity-70 focus:opacity-100" style={{ width: 20, height: 20, left: position, borderWidth: 1, borderColor: colors[parseInt(`${Math.random() * 4}`)], transform: `translateX(-10px)` }}>
                {false ?
                  <img src={`${process.env.PUBLIC_URL}`} className="h-full w-full object-cover" /> :
                  <div className="h-full w-full flex items-center justify-center" style={{ fontSize: 10 }}>
                    <span>{comment.user.firstName[0]}{comment.user.lastName[0]}</span>
                  </div>
                }
              </button>
            </Tooltip>
          )
        }
      })}
    </div>
  );
}
export default Timeline;