import React from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { StyledTableCell, StyledTableRow, useTableStyles } from './styled-table';
import TableBody from '@material-ui/core/TableBody';
import { IProject, IProjectTask } from 'src/store/organisation/type';
import { useNavigate, useParams } from 'react-router-dom';
import { DateTime as d } from "luxon";

interface IProps {
  project: IProject;
  projectTask: IProjectTask
}

const VideoBrowser: React.FC<IProps> = ({ project, projectTask }) => {
  const navigate = useNavigate();
  const classes = useTableStyles();
  const { orgId: selectedOrgId } = useParams<{ orgId: string }>();
  
  let projectMembers = [...project.editors]
  if (project.manager) {
    projectMembers.push(project.manager)
  }

  if (!projectTask.videos.length) {
    return <div className="w-96 h-40 m-auto mt-8 rounded-xl text-sm text-center flex flex-col justify-center">
      <span>
        <svg className="m-auto opacity-50" xmlns="http://www.w3.org/2000/svg" width="57.526" height="37.438" viewBox="0 0 57.526 37.438">
          <g id="Group_13" data-name="Group 13" transform="translate(-176.149 -107.224)">
            <g id="Group_10" data-name="Group 10" transform="translate(188.947 112.266)">
              <path id="Path_16" data-name="Path 16" d="M268.466,143.077l-5.238,26.931-.686,3.526,34.969-.173c1.569-.008,2.96-1.4,3.465-3.472l6.2-25.425c.383-1.572-.458-3.206-1.649-3.205l-35.393.037C269.354,141.3,268.67,142.026,268.466,143.077Z" transform="translate(-262.542 -141.259)" fill="#403d4d" />
            </g>
            <g id="Group_11" data-name="Group 11" transform="translate(176.149 107.224)">
              <path id="Path_17" data-name="Path 17" d="M220.561,139.19l-3.7-29.835a2.348,2.348,0,0,0-2.275-2.131l-8.119.027a2.212,2.212,0,0,0-1.6.711l-3.855,4.1-22.579.118a2.4,2.4,0,0,0-2.257,2.78l3.437,27.576a2.348,2.348,0,0,0,2.272,2.129l39.351-.078c4.383.091,4.8-1.2,4.8-1.2C221.009,144.494,220.562,139.193,220.561,139.19Z" transform="translate(-176.149 -107.224)" fill="#6a667c" />
            </g>
          </g>
        </svg>
      </span>
      <p className="mt-4 text-grey-2">Looks empty in here.<br /> Upload files by clicking the upload button</p>
    </div>
  }

  return (
    <TableContainer style={{ maxHeight: "100%" }} className="px-10">
      <Table stickyHeader className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell></StyledTableCell>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>
              <div className='text-center'>
                Version
              </div>
            </StyledTableCell>
            <StyledTableCell>
              <div className='text-center'>
                Comments
              </div>
            </StyledTableCell>
            <StyledTableCell>Uploaded at</StyledTableCell>
            <StyledTableCell>Uploaded by</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projectTask.videos.map((video, index) => {
            const uploader = projectMembers.find((user) => user._id === video.user);
            const uploaded = new Date(video.uploadedAt);
            const fromattedDate = uploaded.toISOString().substring(0, 10);
            return (
              <StyledTableRow key={index} onClick={() => navigate(`/player/${video._id}?org=${selectedOrgId}&project=${project._id}&task=${projectTask._id}`)}>
                <StyledTableCell className={classes.avatarCell}>
                  <div className="h-8 w-10 bg-bg-dark rounded overflow-hidden flex items-center justify-center" style={{ backgroundColor: "#282831" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" className="opacity-20">
                      <g id="Group_15" data-name="Group 15" transform="translate(-967 -402)">
                        <g id="Ellipse_15" data-name="Ellipse 15" transform="translate(967 402)" fill="none" stroke="#fff" strokeWidth="1">
                          <circle cx="10.5" cy="10.5" r="10.5" stroke="none" />
                          <circle cx="10.5" cy="10.5" r="10" fill="none" />
                        </g>
                        <path id="Path_12" data-name="Path 12" d="M4.316.436a.974.974,0,0,1,1.624,0l4.153,6.272A.974.974,0,0,1,9.281,8.22H.976A.974.974,0,0,1,.164,6.708l2-3.016Z" transform="translate(982.72 407.363) rotate(90)" fill="#fff" />
                      </g>
                    </svg>
                  </div>
                </StyledTableCell>
                <StyledTableCell scope="investor">
                  {video.name}
                </StyledTableCell>
                <StyledTableCell>
                  <div className='text-center'>
                    <div className="h-6 px-2 bg-bg rounded-md inline-flex items-center mx-auto">v{video.version}</div>
                  </div>
                </StyledTableCell>
                <StyledTableCell>
                  <div className='text-center'>
                    <div className="h-6 px-2 bg-bg rounded-md inline-flex items-center">{video.comments.length}</div>
                  </div>
                </StyledTableCell>
                <StyledTableCell>
                  {d.fromISO(video.uploadedAt).toFormat("dd MMM yyyy, hh:mm a")}
                </StyledTableCell>
                <StyledTableCell>{uploader && `${uploader.firstName} ${uploader.lastName}`}</StyledTableCell>
              </StyledTableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
};

export default VideoBrowser;

