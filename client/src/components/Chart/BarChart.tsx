import React from "react";
import { Bar } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";
import { ChartProps } from "./Chart";
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
        hover?: string;
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



const BarChart: React.FC<ChartProps> = ({
  bangalore,
  hyderabad,
  satara,
  xAxis,
}) => {
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
          x: { min: 0,max:xAxis.length},
          y: { min: 0,max:Math.max(...bangalore,...hyderabad,...satara)},
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
    scales: {
      x: {
        grid: {
          color: "#867979",
        },
        ticks: {
          color: "white",
        },
      },
      y: {
        grid: {
          color: "#867979",
        },
        ticks: {
          color: "white",
        },
      },
    },
  };
  const labels: string[] = xAxis;
  const data = {
    labels,
    datasets: [
      {
        label: "Bangalore",
        data: bangalore,
        backgroundColor: "#2196F3",
        borderColor: "#2196F3",
        legendColor: "white",
      },
      {
        label: "Satara",
        data: satara,
        backgroundColor: "#66e226",
        borderColor: "#66e226",
      },
      {
        label: "Hyderabad",
        data: hyderabad,
        backgroundColor: "#e22661",
        borderColor: "#e22661",
      },
    ],
  };
  return <Bar options={options} data={data} />;
};

export default BarChart;
