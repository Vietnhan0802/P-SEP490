import React from 'react'
import "../scss/sidebar.scss";
import { GoPencil } from "react-icons/go";
import { FiBookOpen } from "react-icons/fi";
import { TbFloatLeft } from "react-icons/tb";
import { LuBook } from "react-icons/lu";
import { LuFileEdit } from "react-icons/lu";
import { FaRegCircleCheck } from "react-icons/fa6";
function SideBar() {
  return (
    <div className='sidebar'>
      <div className='upper-section'>
        <div className='mb-3 d-flex align-items-center active-sidebar-item'><GoPencil className='me-3' />Post</div>
        <div className='mb-3 d-flex align-items-center '><FiBookOpen className='me-3'/>Blog</div>
        <div className='mb-3 d-flex align-items-center '><TbFloatLeft className='me-3'/>Own Post</div>
        <div className='mb-3 d-flex align-items-center '><LuBook className='me-3'/>Own Project</div>
        <div className='mb-3 d-flex align-items-center '><LuFileEdit className='me-3'/>Project Application</div>
        <div className='mb-3 d-flex align-items-center '><FaRegCircleCheck className='me-3' />Send Application</div>
      </div>
      <div className='lower-section'>
        <p>Log Out</p>
      </div>
    </div>
  )
}

export default SideBar
