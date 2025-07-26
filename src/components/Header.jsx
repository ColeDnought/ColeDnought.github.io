import './Header.css';

const Header = () => {
  return (
    <div className="app-header">
      <a className="header-link" href="/about">About</a>
      <div className="title-container">
        <h1>
          <span style={{ "color": "rgb(100, 0, 255)" }}>Log</span>
          <span style={{ "color": "rgb(255, 0, 0)" }}>i</span>
          <span style={{ "color": "rgb(100, 0, 255)" }}>t Lens</span>
        </h1>
      </div>
      <a className="header-link" href="/faq">What's happening here?</a>
    </div>
  );
};

export default Header;
