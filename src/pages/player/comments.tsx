import React, { useState } from 'react';
import { setPlayerAction, setTimestampAction } from 'src/store/player/action';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from "dayjs";
import { IState } from 'src/store/config';
import projectAPI from "src/apis/project"
import { useQuery } from 'src/utils/axios-hooks';
import { IComment } from 'src/store/player/type';
import { useEffect } from 'react';
import { formatSeconds, getTimeLength } from 'src/utils/time';
import { useSnackbar, SnackBarVariant } from 'src/utils/snackbar';

interface IProps {
  videoId: string
}

const Comments: React.FC<IProps> = (props) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const snackbar = useSnackbar();
  const dispatch = useDispatch();
  const { user } = useSelector((state: IState) => state.authReducer);
  const { comments } = useSelector((state: IState) => state.playerReducer);


  const { query: getComments } = useQuery(projectAPI.getComments, {
    onSuccess: (res) => {
      const comments: IComment[] = res.data.videoComments || [];
      dispatch(setPlayerAction({ timestamp: -1, comments: comments }));
    }
  });

  useEffect(() => {
    getComments(props.videoId);
  }, [])

  const handleCommentClick = (timestamp: number, index: number) => {
    navigator.clipboard.writeText(`${timestamp}`);
    snackbar({
      visible: true,
      message: "Timestamp copied!",
      variant: SnackBarVariant.SUCCESS
    })
    dispatch(setTimestampAction({ timestamp: timestamp }));
    setSelectedIndex(index);
  }

  return (
    <>
      <div className="p-4">
        <div className="flex items-center ">
          <div className="rounded-full w-10 h-10 bg-bg-light overflow-hidden">
            <img className="w-full h-full object-cover" src={user?.picture} />
          </div>
          <div className="flex flex-1 ml-2 flex-col">
            <span className="text-sm font-semibold">{user?.firstName} {user?.lastName}</span>
            <span className="text-xs text-grey-5">Online</span>
          </div>
        </div>
      </div>
      <div className="flex justify-center border-t border-grey-0 pt-1">
        <div className=" flex text-sm font-semibold">
          <div className="mx-2 px-2 py-2 border-b-2 border-accent text-accent">{comments.length} Comments</div>
          <div className="mx-2 px-2 py-2">File Info</div>
        </div>
      </div>
      {/* <div className="px-4 h-12 flex justify-center bg-bg mx-4 rounded-xl"></div> */}
      <div className="p-4 pt-0">
        {comments.map((comment, index) => (
          <div key={index} className="rounded-xl mb-2 overflow-hidden">
            <div onClick={() => handleCommentClick(comment.timestamp, index)} className={`p-3 hover:bg-bg-light cursor-pointer bg-bg relative`} style={index === selectedIndex ? { backgroundColor: "var(--bg-lightest)" } : {}}>
              <div className={`absolute inset-y-0 w-1 left-0 bg-accent transition-transform transform ${index !== selectedIndex && "-translate-x-1"}`} />
              <div className="flex items-center ">
                <div className="rounded-full w-7 h-7 bg-bg-light overflow-hidden">
                  {false ?
                    <img src={`${process.env.PUBLIC_URL}`} className="h-full w-full object-cover" /> :
                    <div className="h-full w-full flex items-center justify-center text-xs">
                      <span>{comment.user.firstName[0]}{comment.user.lastName[0]}</span>
                    </div>
                  }
                </div>
                <div className="flex flex-1 ml-2 items-center">
                  <span className="text-sm font-semibold">{comment.user.firstName} {comment.user.lastName}</span>
                  <span className="text-xs text-grey-5 ml-2">{getTimeLength(comment.createdAt)}</span>
                </div>
              </div>
              <div className="text-sm pt-2">
                {comment.timestamp >= 0 && <span className="mr-2 font-semibold text-accent">{formatSeconds(comment.timestamp)}</span>}{comment.text}
              </div>
              {/* <div className="text-sm pt-2 flex items-center">
                <div className={`text-sm ${item.likes ? 'text-accent' : 'text-grey-5'} cursor-pointer -mt-0.5 hover:text-accent`}>
                  {item.likes ? <ThumbUpAltRoundedIcon fontSize="inherit" /> : <ThumbUpAltOutlinedIcon fontSize="inherit" />}
                </div>
                <div className="text-sm text-grey-5 ml-4 cursor-pointer hover:text-accent">Reply</div>
              </div> */}
            </div>
            {/* {index === 2 && [1, 2].map((rep, idx) => <div key={idx} className="px-6 pt-3 pl-16 pb-3 -mx-3 border-t border-grey-0  bg-bg hover:bg-bg-light cursor-pointer">
              <div className="flex items-center ">
                <div className="rounded-full w-8 h-8 bg-bg-light"></div>
                <div className="flex flex-1 ml-2">
                  <span className="text-sm">Abhishek Bhaskar</span>
                  <span className="text-sm text-grey-5 ml-2">{item.time} Hrs</span>
                </div>
              </div>
              <div className="text-sm py-2">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat laboriosam a
              </div>
              <div className="text-sm pt-2 flex items-center">
                <div className="text-sm text-grey-5 cursor-pointer -mt-0.5 hover:text-accent">
                  <ThumbUpAltOutlinedIcon fontSize="inherit" />
                </div>
                <div className="text-sm text-grey-5 ml-4 cursor-pointer hover:text-accent">Reply</div>
              </div>
            </div>)} */}
          </div>
        ))}
      </div>
    </>
  );
};

export default Comments;
