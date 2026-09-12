import "./TrustedBrands.css";

const brands = [
  "Luma",
  "Aster & Co.",
  "Mellow",
  "Northstar",
  "Vela",
  "Bloom",
  "Kora",
  "Studio Nine",
];

function TrustedBrands() {
  return (
    <section className="trusted">
      <p className="trusted-label">Trusted by growing brands</p>

      <div className="trusted-track-wrap">
        <div className="trusted-track">
          {/* First set */}
          {brands.map((brand, index) => (
            <span className="brandmark" key={`brand-${index}`}>
              {brand}
            </span>
          ))}

          {/* Duplicate set for seamless marquee */}
          {brands.map((brand, index) => (
            <span className="brandmark" key={`brand-copy-${index}`}>
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustedBrands;

