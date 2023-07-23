import { useState, useRef, useEffect } from "react";
import BarChart from "./BarChart";
import "./Chart.css";
import LineChart from "./LineChart";
import PieChart from "./PieChart";
import { Element } from "react-scroll";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { io, Socket } from "socket.io-client";

export interface ChartProps {
  bangalore: number[];
  hyderabad: number[];
  satara: number[];
  xAxis: string[];
}

const Chart: React.FC = () => {
  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  const socket: Socket = io("http://localhost:5000/");
  socket.on("updateChart", () => {
    console.log("called");
    getData();
  });

  const [activeChart, setActiveChart] = useState<string>("bar");
  const [xAxis, setXAxis] = useState<Array<string>>([]);
  const [bangalore, setBangalore] = useState<Array<number>>([]);
  const [satara, setSatara] = useState<Array<number>>([]);
  const [hyderabad, setHyderabad] = useState<Array<number>>([]);
  const [years, setYears] = useState<Array<number>>([]);
  const [months, setMonths] = useState<Array<string>>([]);
  const [amount, setAmount] = useState<number>(0);

  const yearRef = useRef<HTMLSelectElement | null>(null);
  const monthRef = useRef<HTMLSelectElement | null>(null);

  const handleChartClick = (chartType: string) => {
    setActiveChart(chartType);
  };

  async function getData() {
    const response = await axios.get(
      `http://localhost:5000/donations?year=${yearRef.current?.value}&month=${monthRef.current?.value}`
    );
    const data = await response.data;
    try {
      if (!data.ok) {
        throw new Error(data.error);
      }
      setXAxis(data.xAxisArray);
      setBangalore(data.bangaloreArray);
      setSatara(data.sataraArray);
      setHyderabad(data.hyderabadArray);
      setYears(data.uniqueYearsArray);
      setMonths(data.monthsArray);
      const totalSum = [
        ...data.bangaloreArray,
        ...data.sataraArray,
        ...data.hyderabadArray,
      ].reduce((acc, curr) => acc + curr, 0);
      setAmount(totalSum);
      yearRef.current!.value = data.year;
      monthRef.current!.value = data.month;
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Element name="Chart" className="chartStyle">
      <div className="downloadAndSort">
        <Button type="button" variant="warning">
          Download
        </Button>
        <Form className="sorting">
          <Form.Select
            aria-label="Floating label select example"
            ref={monthRef}
          >
            <option value="Month">Month</option>
            {months.map((month) => (
              <option value={month}>{month}</option>
            ))}
          </Form.Select>
          <Form.Select aria-label="Floating label select example" ref={yearRef}>
            <option value="Year">Year</option>
            {years.map((year) => (
              <option value={year}>{year}</option>
            ))}
          </Form.Select>
          <Button type="button" onClick={getData} variant="secondary">
            Get
          </Button>
        </Form>
      </div>
      <h5>
        Donations in{" "}
        {`${
          monthRef.current?.value !== "Month" ? monthRef.current?.value : ""
        } ${
          yearRef.current?.value !== "Year" ? yearRef.current?.value : "Total"
        }`}
      </h5>
      <h4>&#8377; {amount}</h4>
      <div className="chartSize">
        {activeChart === "bar" && (
          <BarChart
            bangalore={bangalore}
            hyderabad={hyderabad}
            satara={satara}
            xAxis={xAxis}
          />
        )}
        {activeChart === "line" && (
          <LineChart
            bangalore={bangalore}
            hyderabad={hyderabad}
            satara={satara}
            xAxis={xAxis}
          />
        )}
        {activeChart === "pie" && (
          <PieChart
            bangalore={bangalore}
            hyderabad={hyderabad}
            satara={satara}
            xAxis={xAxis}
          />
        )}
      </div>
      <div className="chartOptions">
        <i
          className={`fa-solid fa-chart-simple fa-lg ${
            activeChart === "bar" ? "active" : "inactive"
          }`}
          onClick={() => handleChartClick("bar")}
        ></i>
        <i
          className={`fa-solid fa-chart-line fa-lg ${
            activeChart === "line" ? "active" : "inactive"
          }`}
          onClick={() => handleChartClick("line")}
        ></i>
        <i
          className={`fa-solid fa-chart-pie fa-lg ${
            activeChart === "pie" ? "active" : "inactive"
          }`}
          onClick={() => handleChartClick("pie")}
        ></i>
      </div>
    </Element>
  );
};
export default Chart;
