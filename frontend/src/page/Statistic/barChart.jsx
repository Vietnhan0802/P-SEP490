import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function BarChart({ chartData, value }) {
  console.log(value)
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        // Chỉnh màu chữ cho legend
        color: value ? '#E4E6EB' : '#050505'
      },
      title: {
        display: true,
        text: 'Line Chart Example',
        // Chỉnh màu chữ cho title
        color: value ? '#E4E6EB' : '#050505'
      }
    }
  };

  return <Bar options={options} data={chartData} />;
}

export default BarChart;
