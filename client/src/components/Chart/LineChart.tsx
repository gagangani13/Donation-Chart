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
import { ChartProps } from "./Chart";

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


const LineChart: React.FC<ChartProps> = ({
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
          y: { min: 0,max:Math.max(...bangalore,...hyderabad,...satara)}
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
  return (
      <Line options={options} data={data} />
  );
};

export default LineChart;
