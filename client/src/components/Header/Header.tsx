import { Link } from "react-scroll";
import "./Header.css";
import { motion, Variants } from "framer-motion";
import { useState } from "react";

const Header: React.FC = () => {
  const navLinkVariant: Variants = {
    initial: { scale: 1 },
    whileHover: {
      scale: 1.1,
      fontWeight: "bold",
      transition: { duration: 0.25, type: "tween" },
    },
  };

  const [active, setActive] = useState<string>("nav__menu");
  const [icon, setIcon] = useState<string>("nav__toggler");

  const navToggle = () => {
    if (active === "nav__menu") {
      setActive("nav__menu nav__active");
    } else {
      setActive("nav__menu");
    }

    if (icon === "nav__toggler") {
      setIcon("nav__toggler toggle");
    } else {
      setIcon("nav__toggler");
    }
  };

  return (
    <header>
      <h1>Wathare Infotech Solutions</h1>
      <motion.div className={active}>
        <motion.span
          variants={navLinkVariant}
          initial="initial"
          whileHover="whileHover"
        >
          <Link
            className="NavLink"
            activeClass="activeLink"
            to="Chart"
            spy={true}
            smooth={true}
            offset={-140}
            duration={250}
            onClick={navToggle}
          >
            Chart
          </Link>
        </motion.span>
        <motion.span
          variants={navLinkVariant}
          initial="initial"
          whileHover="whileHover"
        >
          <Link
            className="NavLink"
            activeClass="activeLink"
            to="Donate"
            spy={true}
            smooth={true}
            offset={-400}
            duration={250}
            onClick={navToggle}
          >
            Contribute
          </Link>
        </motion.span>
      </motion.div>
      <div onClick={navToggle} className={icon}>
        <div className="line1"></div>
        <div className="line2"></div>
        <div className="line3"></div>
      </div>
    </header>
  );
};

export default Header;
