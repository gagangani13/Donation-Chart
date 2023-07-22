import React from "react";
import { Bar } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
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
        color?: string;
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
        color?: string; 
        hover?:string
      };
    };
    y?: {
      grid?: {
        color?: string;
      };
      ticks?: {
        color?: string;
      };
    };
  };
};

const options: ChartOptions = {
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        color: "white"
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
        color: "white"
      }
    },
    y: {
      grid: {
        color: "#867979",
      },
      ticks: {
        color: "white"
      },
    },
  }
};

const data = {
  labels,
  datasets: [
    {
      label: "Bangalore",
      data: [32, 42, 51, 60, 51, 95],
      backgroundColor: "#2196F3",
      borderColor: "#2196F3",
      legendColor: "white",
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

const BarChart: React.FC = () => {
  return <Bar options={options} data={data} />;
};

export default BarChart;
