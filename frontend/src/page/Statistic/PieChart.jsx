import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function PieChart({ chartData,value,text }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: value ? '#E4E6EB' : '#050505'
        }
        // Chỉnh màu chữ cho legend
      },
      title: {
        display: true,
        text: `${text}`,
        // Chỉnh màu chữ cho title
        color: value ? '#E4E6EB' : '#050505'
      }
    }}
  return <Pie options={options} data={chartData} />;
}

export default PieChart;