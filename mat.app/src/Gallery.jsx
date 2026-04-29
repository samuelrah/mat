import React from "react";

export default function Gallery() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{height: '100vh', background: '#333', color: 'white'}}>
      <h5>Galleri</h5>
      <p>Bilder på mat och dryck kommer här.</p>
      <div style={{width: '100%', height: 'auto'}}>
        <div><p>Galleri</p></div>
        <img id="galleri-bild" src={"mat.app/public/MAT-IMAGES/1F0A0570-1-1025x1536.jpg"} alt="react logo" />
        <img id="galleri-bild" src={"mat.app/public/MAT-IMAGES/1F0A0622-1536x1025.jpg"} alt="react logo" />
        <img id="galleri-bild" src={"mat.app/public/MAT-IMAGES/1F0A0665-Enhanced-NR-1025x1536.jpg"} alt="react logo" />
        <img id="galleri-bild" src={"mat.app/public/MAT-IMAGES/1F0A0764-Enhanced-NR-1025x1536.jpg"} alt="react logo" />
        <img id="galleri-bild" src={"mat.app/public/MAT-IMAGES/1000_F_60447666_qrATNDQHa7wZzGXIKIcQkuvqqpAFxRUd.jpg"} alt="react logo" />
        <img id="galleri-bild" src={"mat.app/public/MAT-IMAGES/2024D117_ITALIANSEO_POMODORO_2_X-1-768x960.jpg"} alt="react logo" />
        <img id="galleri-bild" src={"mat.app/public/MAT-IMAGES/9854146805790.webp"} alt="react logo" />
        <img id="galleri-bild" src={"mat.app/public/MAT-IMAGES/Chicken-Fajita-Pasta-in-Pan-Square.jpg"} alt="react logo" />
        <img id="galleri-bild" src={"mat.app/public/MAT-IMAGES/creamy_roasted_red_91087_16x9.jpg"} alt="react logo" />
        <img src="/MAT-IMAGES/1F0A0570-1-1025x1536.jpg" alt="Galleri bild" />
        <img src={process.env.PUBLIC_URL + "/MAT-IMAGES/1F0A0570-1-1025x1536.jpg"} alt="Galleri bild" />
      </div>
    </div>
  );
}

// SKA GÖRAS
// bargrundsfärg: #444444
//Zoom in
// $galleri: 444444;
// bg-galleri;