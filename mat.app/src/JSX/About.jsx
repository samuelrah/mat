import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="about-page d-flex flex-column justify-content-center align-items-center" style={{height: '100vh', color: 'white'}}>
      <div className="text-center" style={{marginTop: 100}}>
        <h5>Om oss</h5>
        <p style={{maxWidth: 400}}>
          Här är information om våran resturang, detta är en resturang, det finns massor av mat och drickor och annat type shi.
        </p>
      </div>
      <div className="w-100 d-flex justify-content-between align-items-end" style={{position: 'absolute', bottom: 10, left: 0, padding: '0 20px', fontSize: 17}}>
        <div>
          kontakt information:<br/>
          <a href="samuel.rahseparmohammadi@elev.ga.ntig.se">exempel@gmail.com</a> Telefonnummer: 1177
        </div>
        <div>
          Address: Kronhusgatan
        </div>
      </div>
    </div>
  );
}
