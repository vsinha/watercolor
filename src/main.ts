import "p5";
import * as qopyl from "./artwork/qopyl/main.js";

export const setup = (): void => {
  const width = windowWidth;
  const height = windowHeight;
  const renderer = createCanvas(width, height);
  renderer.parent("art_div");
  qopyl.setup_(width, height, false, 50);
};

export const draw = (): void => {
  qopyl.draw_(deltaTime);
};

// Expose the setup/draw functions to the global scope, because
// the entire code will be wrapped in a large IIFE after bundling.
Object.assign(window, { setup, draw });

document.getElementById("foobar")?.addEventListener(
  "mouseover",
  function (event) {
    console.log("here");
    if (event.target instanceof HTMLElement) {
      const target: HTMLElement = event.target;
      // highlight the mouseover target
      target.style.color = "orange";

      // reset the color after a short delay
      setTimeout(function () {
        target.style.color = "";
      }, 500);
    }
  },
  false
);
