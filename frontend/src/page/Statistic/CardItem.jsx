import React from 'react';
import "./statistic.scss";

const CardItem = ({ icon, title, active, onClick }) => (
  <div
    className={`card bg-white p-2 m-2 mt-0 ${active ? 'active-tab' : ''}`}
    onClick={onClick}
  >
    <div className='d-flex align-items-center justify-content-center'>
      <div className='w-auto h-auto' >{icon}</div>
      <div className="ms-2 fs-12">{title}</div>
    </div>

  </div>
);

export default CardItem;