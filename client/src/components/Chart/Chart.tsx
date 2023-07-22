import { useState } from "react";
import BarChart from "./BarChart";
import "./Chart.css";
import LineChart from "./LineChart";
import PieChart from "./PieChart";
import { Element } from "react-scroll";
import { Form,Button } from "react-bootstrap";

const Chart: React.FC = () => {
  const [activeChart, setActiveChart] = useState<string>("bar");
  const handleChartClick = (chartType: string) => {
    setActiveChart(chartType);
  };
  return (
    <Element name="Chart" className="chartStyle">
      <div className="downloadAndSort">
        <Button type="button" variant="warning">Download</Button>
        <Form className="sorting">
          <Form.Select aria-label="Floating label select example">
            <option value='All'>Month</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </Form.Select>
          <Form.Select aria-label="Floating label select example">
            <option value='All'>Year</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </Form.Select>
          <Button type="submit" variant="light">Sort</Button>
        </Form>
      </div>
      <h5>Donations in</h5>
      <div className="chartSize">
        {activeChart === "bar" && <BarChart />}
        {activeChart === "line" && <LineChart />}
        {activeChart === "pie" && <PieChart />}
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
