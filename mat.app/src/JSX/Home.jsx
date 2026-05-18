import React from "react";
import { useNavigate } from "react-router-dom";

/* Home-komponenten visar startsidan och navigerar till menyn via knapp. */
export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-showcase">
        <div className="showcase-card showcase-left">
          <img src={process.env.PUBLIC_URL + "/MAT-IMAGES/2.jpg"} alt="Restaurang visning vänster" />
        </div>

        <div className="showcase-center">
          <h2>Välkommen till Ember and Oak</h2>
          <p>Upptäck våra signaturrätter och boka bord eller beställ direkt.</p>
          <button className="btn btn-dark" onClick={() => navigate("/menu")}>beställ nu</button>
        </div>

        <div className="showcase-card showcase-right">
          <img src={process.env.PUBLIC_URL + "/MAT-IMAGES/4.jpg"} alt="Restaurang visning höger" />
        </div>
      </div>
    </div>
  );
}
