import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{height: '100vh', color: 'white'}}>
      <h5>Kundvagn</h5>
      <p>Din kundvagn är tom.</p>
    </div>
  );
}
