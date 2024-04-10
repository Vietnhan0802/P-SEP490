import React from "react";
import { Bar } from "react-chartjs-2";

function BarChart({ chartData, value,text }) {
  console.log(value)
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
        text: `Line Chart Example`,
        // Chỉnh màu chữ cho title
        color: value ? '#E4E6EB' : '#050505'
      }
    }
  };

  return <Bar options={options} data={chartData} />;
}

export default BarChart;
