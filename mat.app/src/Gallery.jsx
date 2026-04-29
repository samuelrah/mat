import React from "react";

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
  return (
    <div className="container py-4" style={{ background: "#444444" }}>
      <div className="text-center mb-4">
        <h2 className="text-white">Galleri</h2>
        <p className="text-white-50">Bilder på mat och dryck från vårt galleri.</p>
      </div>

      <div className="row row-cols-3 g-4">
        {images.map((image, index) => (
          <div className="col" key={image}>
            <div className="card h-100 shadow-sm overflow-hidden">
              <img
                src={process.env.PUBLIC_URL + "/MAT-IMAGES/" + image}
                className="card-img-top"
                alt={`Galleri bild ${index + 1}`}
              />
              <div className="card-body bg-dark text-white">
                <p className="card-text mb-0">Bild {index + 1}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


