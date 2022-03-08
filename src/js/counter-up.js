import counterUp from "counterup2";

const firstEl = document.querySelector(".counter");
const secondEl = document.querySelector(".counter-2");
const thirdEl = document.querySelector(".counter-3");

const callback = (entries) => {
  entries.forEach((entry) => {
    const el = entry.target;
    if (entry.isIntersecting) {
      counterUp(firstEl, {
        duration: 1000,
        delay: 16,
      });
      counterUp(secondEl, {
        duration: 1000,
        delay: 16,
      });
      counterUp(thirdEl, {
        duration: 1000,
        delay: 16,
      });
    }
  });
};

const firstElObserver = new IntersectionObserver(callback, { threshold: 1 });
firstElObserver.observe(firstEl);
