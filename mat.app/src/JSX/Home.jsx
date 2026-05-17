import React from "react";
import { useNavigate } from "react-router-dom";

/* Home-komponenten visar startsidan och navigerar till menyn via knapp. */
export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="content text-center">
      <button className="btn btn-dark" onClick={() => navigate("/menu")}>beställ nu</button>
    </div>
  );
}
