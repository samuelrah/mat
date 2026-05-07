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
    <div className="about-page d-flex flex-column justify-content-center" style={{height: '100vh', color: 'white'}}>
      <div className="text-center" style={{marginTop: 100, maxWidth: "45%"}}>
        <h5>Om oss</h5>
        <p style={{fontSize: 15}}>
          Restaurang Solgläntan ligger vid en liten hamn och är känd för sin avslappnade 
          stämning och sina färska råvaror. Gästerna möts av doften från nybakat bröd och 
          grillad fisk redan vid dörren. Menyn ändras varje vecka beroende på säsong och 
          lokala leveranser, vilket gör varje besök unikt. Personalen är vänlig, snabb och 
          alltid redo att rekommendera passande drycker till maten. Många uppskattar särskilt 
          restaurangens krämiga skaldjurssoppa och hemmagjorda citronpaj.
          <br></br>
          På kvällarna spelas lugn jazzmusik som skapar en varm och trivsam atmosfär för både 
          familjer, turister och stamgäster från området. Under sommaren fylls uteserveringen 
          snabbt av människor som vill njuta länge tillsammans.
        </p>
        {/* FIX FIX FIX */}
          <img src="mat.app/public/MAT-IMAGES/15.jpg" alt="chef" style={{height: "100px", width: "100px"}}/>      
          </div>
      <div className="w-100 d-flex justify-content-between align-items-end" 
        style={{position: 'absolute', bottom: 10, left: 0, padding: '0 20px', fontSize: 17}}>
        <div>
          kontakt information:<br/>
            <a 
              href="https://mail.google.com/mail/?view=cm&fs=1&to=samuel.rahseparmohammadi@elev.ga.ntig.se" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{color:"white", marginRight: "20px"}}
            >
              samuel.rahseparmohammadi@elev.ga.ntig.se
            </a>
            <a href="tel:1177" style={{color:"white"}}>Telefonnummer: 1177</a>
        </div>
        <div>
          <a 
            href="https://www.google.com/maps/place/Kronhusgatan,+G%C3%B6teborg/@57.7080738,11.9615355,17z/data=!3m1!4b1!4m6!3m5!1s0x464ff366c121e4f9:0x7f1e435a31e89d09!8m2!3d57.708071!4d11.9641104!16s%2Fg%2F11dylhvs0?entry=ttu&g_ep=EgoyMDI2MDUwMi4wIKXMDSoASAFQAw%3D%3D"
            target="blank"
            rel="noopener noreferrer"
            style={{color:"white"}}
            >
              Address: Kronhusgatan
            </a>
        </div>
      </div>
    </div>
  );
}
