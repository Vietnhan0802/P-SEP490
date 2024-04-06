import React from 'react';
import "./statistic.scss";
import { TbPresentationAnalytics } from "react-icons/tb";
import { SlChart } from "react-icons/sl";
const CardItem = ({ icon, title, count, active, onClick }) => (
  <div
    className={`card bg-white p-2 m-2 mt-0 ${active ? 'active-tab' : ''}`}
    onClick={onClick}
  >
    <div className="mb-1 fs-12">{title}</div>
    <div className="d-flex justify-content-between align-items-center">
      {icon}
      <p className="rounded-pill percent fw-bold d-flex justify-content-center align-items-center">
        {count}
      </p>
    </div>
    <hr style={{ margin: '0.5rem 0' }} />
    <p className="d-flex justify-content-end detail">
      {active ? <TbPresentationAnalytics /> : <SlChart />}
    </p>
  </div>
);

export default CardItem;