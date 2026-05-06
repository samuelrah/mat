import React, { useState } from "react";

const images = [
  "1.jpg",
  "2.jpg",
  "3.jpg",
  "4.jpg",
  "5.jpg",
  "6.jpg",
  "7.webp",
  "8.jpg",
  "9.jpg",
];

export default function Gallery() {
  const [hovered, setHovered] = useState(null);
  const [zoomed, setZoomed] = useState(null);

  return (
    <div className="gallery-page" style={{ background: "#444444", minHeight: "100vh" }}>
      <div className="container-fluid py-4 px-5">
        <div className="gallery-header mb-4">
          <h2 className="text-white" style={{'margin-top': '100px', 'text-align': 'left'}}>Galleri</h2>
          <p className="text-white-50">Bilder på mat och dryck från vår galleri.</p>
        </div>

        <div className="row row-cols-3 g-4">
          {images.map((image, index) => (
            <div className="col" key={image}>
              <div className="card h-auto shadow-sm overflow-hidden" style={{ borderRadius: 0, position: 'relative' }}>
                <img
                  src={process.env.PUBLIC_URL + "/MAT-IMAGES/" + image}
                  className="card-img-top"
                  alt={`Galleri bild ${index + 1}`}
                  style={{
                    height: "370px",
                    objectFit: "cover",
                    width: "100%",
                    borderRadius: 0,
                    border: hovered === index ? '1px solid white' : '0px solid transparent',
                    transition: 'border-color 0.3s ease',
                  }}
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setZoomed(image)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {zoomed && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            cursor: 'pointer',
          }}
          onClick={() => setZoomed(null)}
        >
          <img
            src={process.env.PUBLIC_URL + "/MAT-IMAGES/" + zoomed}
            alt="Zoomed image"
            style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: 0 }}
          />
        </div>
      )}
    </div>
  );
}