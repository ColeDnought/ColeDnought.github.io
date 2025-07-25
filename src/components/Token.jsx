import './Token.css';

const ProbToken = ({ probability, token, alternative }) => {
    const blue = Math.floor(255 * probability);
    const red = Math.floor(255 * (1 - probability));

    return (
        <div className="prob-token" style={{ color: `rgb(${red}, 0, ${blue})`, whiteSpace: 'pre-wrap' }}>
            {alternative && <span className="tooltip-text">{alternative}</span>}
            {token}
        </div>
    );
}

export default ProbToken;