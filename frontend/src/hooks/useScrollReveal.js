import { useEffect } from "react";

function useScrollReveal() {
  useEffect(() => {
    const revealEls = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    revealEls.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);
}

export { useScrollReveal };