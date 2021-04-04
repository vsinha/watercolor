import "p5";
import * as qopyl from "./artwork/qopyl/main.js";
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
