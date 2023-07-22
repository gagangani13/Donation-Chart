import { createContext } from 'react';

export interface ChartData  {
  label: string;
  value: number;
  id:number
};


const ChartContext = createContext<{
  data: ChartData[];
  updateData: (params: ChartData[]) => void;
}>({
  data: [],
  updateData: () => {},
});

export default ChartContext;
