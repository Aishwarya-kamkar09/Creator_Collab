import "./CreatorMarquee.css";
import { creators } from "../../data/homeData";
import CreatorCard from "../CreatorCard/CreatorCard";

function CreatorMarquee() {
  return (
    <section className="creator-row">
      <div className="marquee-track">
        {[...creators, ...creators].map((creator, index) => (
          <CreatorCard
            key={`${creator.name}-${index}`}
            creator={creator}
          />
        ))}
      </div>
    </section>
  );
}

export default CreatorMarquee;