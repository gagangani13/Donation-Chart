import React from "react";
import { Line } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

const labels: string[] = ["2017", "2018", "2019", "2020", "2021", "2022"];

type ChartOptions = {
  plugins?: {
    legend?: {
      position?: "bottom" | "center" | "left" | "top" | "right" | "chartArea";
      labels?: {
        color?: string; // Color of the legend text
      };
    };
    zoom?: {};
  };
  scales?: {
    x?: {
      grid?: {
        color?: string;
      };
      ticks?: {
        color?: string; // Color of x-axis labels
      };
    };
    y?: {
      grid?: {
        color?: string;
      };
      ticks?: {
        color?: string; // Color of y-axis labels
      };
    };
  };
};

const options: ChartOptions = {
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        color: "white", // Change the color of the legend text to white,
      },
    },
    zoom: {
      pan: {
        enabled: true,
      },
      limits: {
        x: { min: 0,max:100 },
        y: { min: 0,max:100 },
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
    }
  },
  scales: {
    x: {
      grid: {
        color: "#867979",
      },
      ticks: {
        color: "white", // Change the color of x-axis labels
      },
    },
    y: {
      grid: {
        color: "#867979",
      },
      ticks: {
        color: "white", // Change the color of y-axis labels
      },
    },
  },
};

const data = {
  labels,
  datasets: [
    {
      label: "Bangalore",
      data: [32, 42, 51, 60, 51, 95],
      backgroundColor: "#2196F3",
      borderColor: "#2196F3",
    },
    {
      label: "Satara",
      data: [37, 42, 41, 37, 31, 44],
      backgroundColor: "#66e226",
      borderColor: "#66e226",
    },
    {
      label: "Hyderabad",
      data: [60, 54, 54, 28, 27, 49],
      backgroundColor: "#e22661",
      borderColor: "#e22661",
    },
  ],
};
const LineChart: React.FC = () => {
  return (
      <Line options={options} data={data} />
  );
};

export default LineChart;
