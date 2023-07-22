import React from "react";
import { Pie } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, zoomPlugin);

const labels: string[] = ["Bangalore", "Satara", "Hyderabad"];

type ChartOptions = {
  plugins?: {
    legend?: {
      position?: "bottom" | "center" | "left" | "top" | "right" | "chartArea";
      labels?: {
        color?: string;
      };
    };
    zoom?: {};
  };
};

const options: ChartOptions = {
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        color: "white",
      },
    },
    zoom: {
      pan: {
        enabled: true,
      },
      limits: {
        x: { min: 0, max: 100 },
        y: { min: 0, max: 100 },
      },
      zoom: {
        wheel: {
          enabled: true,
        },
        pinch: {
          enabled: true,
        },
        mode: "xy",
      },
    },
  },
};

const data = {
  labels,
  datasets: [
    {
      label: "2022",
      data: [32, 42, 51],
      //   backgroundColor: "#2196F3",
      borderColor: "#00000080",
      backgroundColor: ["#2196F3", "#66e226", "#e22661"],
      borderWidth: 5,
      //   borderColor: ["#2196F3","#66e226","#e22661"],
    },
    {
      label: "2021",
      data: [37, 42, 41],
      //   backgroundColor: "#66e226",
      borderColor: "#00000080",
      backgroundColor: ["#2196F3", "#66e226", "#e22661"],
      borderWidth: 5,
    },
    {
      label: "2020",
      data: [60, 54, 54],
      //   backgroundColor: "#e22661",
      borderColor: "#00000080",
      backgroundColor: ["#2196F3", "#66e226", "#e22661"],
      borderWidth: 5,
    },
  ],
};
const PieChart: React.FC = () => {
  return (
    <div style={{ width: "50%" }}>
      <Pie options={options} data={data} />;
    </div>
  );
};

export default PieChart;
