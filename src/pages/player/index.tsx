import React, { useState } from 'react';
import { useEffect } from 'react';
import Comments from './comments';
import VideoJS from './videojs';
import AppHeader from 'src/components/header';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from 'src/utils/axios-hooks';
import projectAPI from 'src/apis/project';
import { IVideo } from 'src/store/player/type';
import { IProjectTask } from 'src/store/organisation/type';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';

const PlayerPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const [projectTask, setProjectTask] = useState<IProjectTask>();
  const [searchParams] = useSearchParams();
  const [queryParams] = useState({
    organisation: searchParams.get('org'),
    project: searchParams.get('project'),
    task: searchParams.get('task')
  });

  // canvas dimetions in "rem"
  const [canvasDimensions, setCanvasDimentions] = useState<number[]>([0, 0]);
  const updateCanvasDimentions = () => {
    const width = (window.innerWidth / 16) - (25 + 3);
    const height = (window.innerHeight / 16) - (6 + 1.5 + 5 + 3);
    let finalWidth = width;
    let finalHeight = width * 9 / 16;
    if (finalHeight > height) {
      finalWidth = height * 16 / 9;
      finalHeight = height
    }
    setCanvasDimentions([finalWidth, finalHeight]);
  }
  const [selectedVideo, setSelectedVideo] = useState<IVideo | undefined>();

  const { query: getProjectTask } = useQuery<any, any>(projectAPI.getProjectTask, {
    onSuccess: (res) => {
      const { projectTask } = res.data;
      const video = projectTask.videos.find((v: IVideo) => v._id === videoId);
      if (video) {
        setSelectedVideo(video);
      }
      setProjectTask(projectTask);
    }
  });

  useEffect(() => {
    updateCanvasDimentions();
    window.addEventListener("resize", updateCanvasDimentions);
    return () => window.removeEventListener("resize", updateCanvasDimentions);
  }, []);

  useEffect(() => {
    if (queryParams.organisation && queryParams.project && queryParams.task) {

      getProjectTask({
        organisation: queryParams.organisation,
        project: queryParams.project,
        task: queryParams.task
      });
    }
  }, [queryParams]);

  if (!queryParams.organisation || !projectTask || !videoId) {
    return (
      <div className="absolute inset-x-0 h-12 top-0 flex items-end mx-6">
        <div className="flex flex-1 items-center">
          <CircularProgress color="secondary" size={20} thickness={5} />
        </div>
      </div>
    )
  }

  return (
    <>
      {
        selectedVideo && (
          <div className="absolute inset-0 bg-bg-dark">
            <div className="absolute inset-x-0 top-0 h-12 flex">
              <div className="flex flex-1 items-center pl-4">
              </div>
              <div style={{ width: "25rem" }} className="flex justify-end items-center pr-4 text-sm border-b border-l border-bg-dark bg-bg">
                <AppHeader />
              </div>
            </div>
            <div className="absolute top-12 inset-x-0 bottom-0 flex">
              {/* video */}
              <div className="flex flex-1 flex-col">
                <VideoJS dimentions={canvasDimensions} video={selectedVideo} organisation={queryParams.organisation} projectTask={projectTask} />
              </div>
              {/* comments */}
              <div style={{ width: "25rem" }} className="bg-bg border-l border-bg-dark overflow-y-scroll">
                <Comments videoId={videoId} />
              </div>
            </div>
          </div>
        )
      }
    </>
  );
};

export default PlayerPage;
