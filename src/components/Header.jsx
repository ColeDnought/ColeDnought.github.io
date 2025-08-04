import './Header.css';
import NamePlate from './NamePlate';
import { Link } from "react-router";

const Header = () => {
  return (
    <div className="app-header">
      <Link to="/about" className="header-link">About the Author</Link>
      <div className="title-container">
        <h1>
          <NamePlate />
        </h1>
      </div>
      <Link to="/faq" className="header-link">What's happening here?</Link>
    </div>
  );
};

export default Header;
