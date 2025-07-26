const ColorScale = () => (
  <div style={{
    position: 'fixed',
    bottom: 10,
    left: 0,
    width: '100%',
    padding: '8px 20px',
    backgroundColor: '#fff',
    boxSizing: 'border-box',
    zIndex: 1000
  }}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span style={{ color: '#000', whiteSpace: 'nowrap' }}>Lowest</span>
      <div style={{ flexGrow: 1, height: '8px', margin: '0 10px', background: 'linear-gradient(to right, red, blue)' }} />
      <span style={{ color: '#000', whiteSpace: 'nowrap' }}>Highest</span>
    </div>
    <span>Token Probability</span>
  </div>
);

export default ColorScale;
