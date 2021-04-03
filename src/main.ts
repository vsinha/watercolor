import p5 from "p5";

import * as seluj from "./artwork/seluj/main.js";
// function sketch_idnameofdiv(p) {
//   p.setup = function () {
//     p.createCanvas(400, 400);
//   };

//   p.draw = function () {
//     // stuff to draw
//     p.background("orange");
//   };
// }
// new p5(sketch_idnameofdiv, "art");

export const setup = (): void => {
  const width = windowWidth;
  const height = 500;
  const renderer = createCanvas(width, height);
  renderer.parent("art_div");
  seluj.setup_sized(width, height);
};

export const draw = (): void => {
  seluj.draw();
};

// Expose the setup/draw functions to the global scope, because
// the entire code will be wrapped in a large IIFE after bundling.
Object.assign(window, { setup, draw });
