import React, { useState } from 'react';
import ChartContext, { ChartData } from './ChartContext';

interface ChartProviderProps {
  children: React.ReactNode;
}

const ChartProvider: React.FC<ChartProviderProps> = (props) => {
  const [data, setData] = useState<ChartData[]>([{ label: 'Category 1', value: 10,id:1 },
  { label: 'Category 2', value: 20,id:2 },]);

  function updateDataHandler(params: ChartData[]): void {
    setData(params);
  }

  const context = {
    data: data,
    updateData: updateDataHandler,
  };

  return (
    <ChartContext.Provider value={context}>
      {props.children}
    </ChartContext.Provider>
  );
};

export default ChartProvider;

