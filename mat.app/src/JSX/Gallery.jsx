import React, { useState } from "react";
import { galleryImages } from "./menuData";

/* Gallery-komponenten visar ett klickbart galleriflöde med hover- och zoom-effekter. */
export default function Gallery() {
  const [hovered, setHovered] = useState(null);
  const [zoomed, setZoomed] = useState(null);

  return (
    <div className="gallery-page">
      <div className="gallery-content">
        <div className="gallery-header mb-4">
          <h2>Galleri</h2>
          <p>Bilder på mat och dryck från våra menyer.</p>
        </div>

        <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4 gallery-grid">
          {galleryImages.map((image, index) => (
            <div className="col" key={image}>
              <div className="gallery-card">
                <img
                  src={process.env.PUBLIC_URL + "/MAT-IMAGES/" + image}
                  className={`gallery-image ${hovered === index ? "hovered" : ""}`}
                  alt={`Galleri bild ${index + 1}`}
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
