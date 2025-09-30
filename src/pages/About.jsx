import React, { useEffect } from 'react';
import { Link } from "react-router";
import './Page.css';

const About = () => {
  // Load LinkedIn badge script to render badge
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://platform.linkedin.com/badges/js/profile.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="page">
      <Link to="/" className="back-arrow">&larr;</Link>
      <h2>About the Author</h2>
      <div className='columnView'>
        <div className='about-content detailfield'>
          <p>I'm a graduate student at Cornell University, interested in Machine Learning for Accessibility.</p>
          <p>This is a personal project to show how Language Models can be:</p>
          <ol>
            <li>Used beyond generating text</li>
            <li>Deployed on personal devices</li>
            <li>Explored and understood interactively</li>
          </ol>
          <p>
            If you would like to see more technical details or contribute to this project, I encourage you to check out the <a href="https://github.com/ColeDnought/logitlens.git">GitHub repository</a>.
            Or feel free to follow me on <a href="https://www.linkedin.com/in/cole-donat/">LinkedIn</a> to see what I'm up to next!
          </p>
        </div>
        <div className="linkedin-section">
          <div className="badge-base LI-profile-badge" data-locale="en_US" data-size="large" data-theme="light" data-type="HORIZONTAL" data-vanity="cole-donat" data-version="v1">
            <a className="badge-base__link LI-simple-link" href="https://www.linkedin.com/in/cole-donat?trk=profile-badge"></a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
