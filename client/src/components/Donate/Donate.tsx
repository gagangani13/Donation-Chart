import "./Donate.css";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.css";
import { Element } from "react-scroll";
import { Button } from "react-bootstrap";
import { useRef, FormEvent } from "react";
import axios from "axios";
import { io,Socket  } from "socket.io-client";
interface DonateProps {}

const Donate: React.FC<DonateProps> = () => {
  const amountRef = useRef<HTMLInputElement>(null); 
  const placeRef = useRef<HTMLSelectElement>(null); 
  const dateRef = useRef<HTMLInputElement>(null); 

  const socket:Socket = io("https://donation-chart-server.onrender.com/");

async  function donateHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = amountRef.current?.value;
    const place = placeRef.current?.value;
    const date = dateRef.current?.value;
    if (!amount||!place||!date) {
      alert('Please fill the form')
    }
    const response=await axios.post('https://donation-chart-server.onrender.com/addAmount',{amount,place,date})
    const data=await response.data;
    try {
      if (!data.ok) {
        throw new Error(data.error)
      }
      amountRef.current!.value='';
      placeRef.current!.value='';
      dateRef.current!.value='';
      alert('Thank you')
      socket.emit('Donated')
    } catch (error) {
      alert(error);
    }
  }

  return (
    <Element name="Donate" className="Donate">
      <h3>
        Contribute<i className="fa-solid fa-heart fa-beat-fade fa-lg"></i>
      </h3>
      <Form className="form" onSubmit={donateHandler}>
        <FloatingLabel controlId="floatingInputGrid" label="Amount in Rupees">
          <Form.Control type="number" min={1} required ref={amountRef} />
        </FloatingLabel>
        <Form.Select required ref={placeRef}>
          <option value="Bangalore">Bangalore</option>
          <option value="Satara">Satara</option>
          <option value="Hyderabad">Hyderabad</option>
        </Form.Select>
        <FloatingLabel controlId="floatingInputGrid" label="Date">
          <Form.Control type="date" required ref={dateRef} />
        </FloatingLabel>
        <Button variant="dark" type="submit">
          Send
        </Button>
      </Form>
    </Element>
  );
};

export default Donate;
