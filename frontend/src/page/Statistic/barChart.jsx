import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function BarChart({ chartData }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        // Chỉnh màu chữ cho legend
        color: 'rgb(255, 255, 255)'
      },
      title: {
        display: true,
        text: 'Line Chart Example',
        // Chỉnh màu chữ cho title
        color: 'rgb(255, 255, 255)'
      }
    }
  };

  return <Bar options={options} data={chartData} />;
}

export default BarChart;
