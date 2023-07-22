import { Link } from "react-scroll";
import "./Header.css";

const Header = () => {
  return (
    <header>
      <h1>Wathare Infotech Solutions</h1>
      <nav>
        <Link
          className="NavLink"
          activeClass="activeLink"
          to="Chart"
          spy={true}
          smooth={true}
          offset={-140}
          duration={250}
        >
          Chart
        </Link>
        <Link
          className="NavLink"
          activeClass="activeLink"
          to="Donate"
          spy={true}
          smooth={true}
          offset={-400}
          duration={250}
        >
          Contribute
        </Link>
      </nav>
    </header>
  );
};

export default Header;
