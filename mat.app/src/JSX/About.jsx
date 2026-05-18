import React from "react";

/* About-komponenten visar information om restaurangen och kontaktuppgifter. */
export default function About() {
  return (
    <div
      className="about-page d-flex flex-column"
      style={{
        minHeight: "100vh",
        color: "white",
        position: "relative",
      }}
    >

      {/* Huvudinnehåll */}
      <div
        className="about-main-section d-flex justify-content-between align-items-center"
        style={{
          marginTop: 100,
          width: "100%",
          maxWidth: "1200px",
          padding: "0 20px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >

        {/* Text */}
        <div
          className="about-text-box"
          style={{ maxWidth: "50%" }}
        >
          <h5>Om oss</h5>

          <p style={{ fontSize: 19 }}>
            Restaurang Solgläntan ligger vid en liten hamn och är känd för sin
            avslappnad stämning och sina färska råvaror. Gästerna möts av
            doften från nybakat bröd och grillad fisk redan vid dörren.

            Menyn ändras varje vecka beroende på säsong och lokala leveranser,
            vilket gör varje besök unikt. Personalen är vänlig, snabb och
            alltid redo att rekommendera passande drycker till maten.

            Många uppskattar särskilt restaurangens krämiga skaldjurssoppa och
            hemmagjorda citronpaj.

            <br />
            <br />

            På kvällarna spelas lugn jazzmusik som skapar en varm och trivsam
            atmosfär för både familjer, turister och stamgäster från området.

            Under sommaren fylls uteserveringen snabbt av människor som vill
            njuta länge tillsammans.
          </p>
        </div>

        {/* Bild */}
        <div
        className="about-image-wrapper d-flex justify-content-center"
          style={{ width: "45%", minHeight: "300px" }}
        >
          <img
            src="/MAT-IMAGES/16.jpg"
            alt="chef"
            className="about-image"
          />
        </div>
      </div>

      {/* Footer */}
      <div
        className="about-footer w-100 d-flex justify-content-between align-items-center"
        style={{
          padding: "20px",
          fontSize: 15,
          margin: "20px",
          marginTop: "auto",
        }}
      >

        <div className="about-contact">
          Kontakt information:
          <br />

          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=emberandoak@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginRight: "20px" }}
          >
            emberandoak@gmail.com
          </a>

          <a href="tel:1177">
            Telefonnummer: 1177
          </a>
        </div>

        <div className="about-address">
          <a
            href="https://www.google.com/maps/place/Kronhusgatan,+G%C3%B6teborg/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Address: Kronhusgatan
          </a>
        </div>

      </div>
    </div>
  );
}