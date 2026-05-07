import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="content text-center">
      <button className="btn btn-dark" onClick={() => navigate("/menu")}>beställ nu</button>
    </div>
  );
}
