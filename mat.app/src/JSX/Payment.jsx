import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Payment() {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(saved);

    const getUnitPrice = (item) => {
      const candidates = [item.price, item.unitPrice];
      for (const c of candidates) {
        const n = Number(c);
        if (!isNaN(n)) return n;
      }
      if (item.totalPrice && item.quantity) {
        const n = Number(item.totalPrice) / Number(item.quantity);
        if (!isNaN(n)) return n;
      }
      return 0;
    };

    const total = (saved || []).reduce((sum, item) => {
      const unit = getUnitPrice(item);
      const qty = Number(item.quantity) || 1;
      return sum + unit * qty;
    }, 0);

    setTotalAmount(total);
  }, []);

  return (
    <div className="container py-4" style={{ color: "white" }}>
      <h4>Betalning</h4>
      <div className="card bg-dark text-white p-4 rounded my-3">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <p className="mb-1">Att betala</p>
            <h5 className="mb-0">{Number(totalAmount).toFixed(0)} kr</h5>
          </div>
          <div>
            <button className="btn btn-secondary me-2" onClick={() => navigate('/cart')}>Tillbaka till kundvagn</button>
            <button className="btn btn-success" onClick={() => alert('Simulerad betalning: ' + Number(totalAmount).toFixed(0) + ' kr')}>Betala</button>
          </div>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <p>Din kundvagn är tom.</p>
      ) : (
        <div className="list-group">
          {cartItems.map((it, i) => (
            <div key={`${it.name}-${it.restaurantName}-${i}`} className="list-group-item list-group-item-dark mb-2 rounded">
              <div className="d-flex justify-content-between">
                <div>
                  <strong>{it.name}</strong>
                  <div><small>{it.restaurantName}</small></div>
                </div>
                <div className="text-end">
                  <div>{(Number(it.quantity) || 1)} x {(Number(it.price) || Number(it.unitPrice) || (Number(it.totalPrice)||0)/(Number(it.quantity)||1)).toFixed(0)} kr</div>
                  <div><strong>{(Number(it.totalPrice) || ( (Number(it.price)||Number(it.unitPrice) || 0) * (Number(it.quantity)||1) )).toFixed(0)} kr</strong></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
