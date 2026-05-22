import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export default function Payment() {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
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

  const handlePayment = async () => {
    setMessage("");
    setLoading(true);

    if (!customerEmail || !customerName) {
      setMessage("✗ Error: Please enter your name and email address.");
      setLoading(false);
      return;
    }

    if (!customerEmail.includes("@")) {
      setMessage("✗ Error: Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      // Send the payment request with receipt email
      const response = await fetch(`${API_URL}/api/send-receipt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerEmail,
          customerName,
          cartItems,
          totalAmount: Number(totalAmount).toFixed(2),
          orderId: `ORD-${Date.now()}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Payment failed");
      }

      setMessage(`✓ Payment successful! Receipt sent to ${customerEmail}`);
      // Clear cart after successful payment
      localStorage.removeItem("cart");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setMessage(`✗ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

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
            <button className="btn btn-success" onClick={handlePayment} disabled={loading}>
              {loading ? "Bearbetar..." : "Betala"}
            </button>
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`alert ${
            message.includes("✓") ? "alert-success" : "alert-danger"
          } my-3`}
        >
          {message}
        </div>
      )}

      <div className="card bg-dark text-white p-4 rounded my-3">
        <h5>Leveransinformation</h5>
        <div className="mb-3">
          <label htmlFor="customerName" className="form-label">Namn *</label>
          <input
            type="text"
            id="customerName"
            className="form-control"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Ange ditt namn"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="customerEmail" className="form-label">E-post *</label>
          <input
            type="email"
            id="customerEmail"
            className="form-control"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="Ange din e-postadress"
            required
          />
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
