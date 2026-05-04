import React from "react";

export default function Admin() {
  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>Adminpanel</h2>
        <p>Översikt av webbplatsstatistik och användarhantering.</p>
      </div>

      <div className="admin-grid">
        <section className="admin-card">
          <h3>Webbplatsstatistik</h3>
          <div className="stat-row">
            <div>
              <strong>Besökare idag</strong>
              <p>1 248</p>
            </div>
            <div>
              <strong>Sidvisningar</strong>
              <p>4 562</p>
            </div>
          </div>
          <div className="stat-row">
            <div>
              <strong>Aktiva användare</strong>
              <p>67</p>
            </div>
            <div>
              <strong>Nya konton</strong>
              <p>12</p>
            </div>
          </div>
        </section>

        <section className="admin-card admin-users">
          <h3>Användarhantering</h3>
          <p>Hantera konton, roller och åtkomst.</p>
          <ul>
            <li>Benjamin Nethanyahu — Aktiv</li>
            <li>Ben the dog — Inaktiv</li>
            <li>Dedu — Admin</li>
            <li>jadu — Aktiv</li>
          </ul>
          <button className="admin-action">Öppna användaröversikt</button>
        </section>
      </div>
    </div>
  );
}
