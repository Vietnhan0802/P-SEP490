import React from 'react'
import "../scss/sidebar.scss";
import { GoPencil } from "react-icons/go";
function SideBar() {
  return (
    <div className='sidebar'>
      <div className='uppper-section'>
        <div><GoPencil />Post</div>
        <div>Blog</div>
        <div>Own Post</div>
        <div>Own Blog</div>
        <div>Own Project</div>
        <div>Project Application</div>
        <div>Send Application</div>
      </div>
      <div className='lower-section'></div>
    </div>
  )
}

export default SideBar
