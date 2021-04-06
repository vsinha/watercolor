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
