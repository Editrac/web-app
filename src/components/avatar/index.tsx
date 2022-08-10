import React from 'react';

interface Props {
  image?: string;
  initials: string;
  size: 4 | 5 | 6 | 7 | 8 | 9 | 10;
  color?: string;
  crown?: boolean
}
const Avatar: React.FC<Props> = ({ image, initials, size, color, crown }) => {
  return (
    <div className='relative'>
      <div className={`w-${size} h-${size} relative rounded-full bg-bg-light overflow-hidden cursor-pointer flex items-center justify-center text-xs font-semibold`} style={{ boxShadow: `0 0 0 2px transparent`, backgroundColor: color }}>
        {image ?
          <img src={image} className="h-full w-full object-cover" /> :
          <span>{initials}</span>
        }
      </div>
      {crown && <div className='absolute -top-1.5 inset-x-0 h-3 flex justify-center'>
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 30 26.629">
          <g id="Group_18" data-name="Group 18" transform="translate(-114 -328)">
            <path id="Path_22" data-name="Path 22" d="M137.658,351.466h-17.6a.421.421,0,0,0-.409.435v.008A3.056,3.056,0,0,0,122.613,355H135.1a3.059,3.059,0,0,0,2.962-3.094A.421.421,0,0,0,137.658,351.466Z" transform="translate(0 -0.371)" fill="#fff" />
            <path id="Path_23" data-name="Path 23" d="M141.471,333.37a2.516,2.516,0,0,0-2.335,3.481l-5.517,4.566a.725.725,0,0,1-1.152-.328q-1.215-4.18-2.431-8.358a2.531,2.531,0,1,0-2.313.046l-2.466,8.322a.725.725,0,0,1-.918.454.715.715,0,0,1-.233-.13l-5.321-4.4a2.529,2.529,0,1,0-2.258,1.388c.035,0,.069,0,.1,0l2.866,9.908a.157.157,0,0,0,.153.115h18.42a.158.158,0,0,0,.153-.115l2.873-9.934a2.627,2.627,0,0,0,.375.03,2.518,2.518,0,1,0,0-5.036Z" transform="translate(0)" fill="#fff" />
          </g>
        </svg>
      </div>}
    </div>
  );
};

export default Avatar;