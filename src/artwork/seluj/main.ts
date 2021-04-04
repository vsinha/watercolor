import p5, { Vector } from "p5";
import * as Moremath from "../../lib/moremath.js";

const num_points = 40000;
let points: p5.Vector[][] = [];

const new_random_point = (width: number, height: number) =>
  createVector(random(0, width), random(0, height));

export const setup_sized = (width: number, height: number): void => {
  points = Array.from({ length: num_points }, () => [
    new_random_point(width, height),
  ]);

  background("rgba(20, 20, 20, 1)");

  d();
};

export const setup = (): void => {
  createCanvas(windowWidth, windowHeight);
  setup_sized(windowWidth, windowHeight);
};

const denominator = Math.round(Moremath.randRange(2, 10));
const multiple = Math.PI / denominator;

function update() {
  const s = 0.01;
  const offset = 70;
  points = points.map(() => {
    const new_line = [new_random_point(windowWidth, windowHeight)];
    for (let i = 0; i < 20; i++) {
      const p = new_line[i] || createVector(0, 0);
      // const next_point = createVector(p?.x, p?.y);
      const n = createVector(
        offset * (noise(p.x * s, p.y * s, 0.0) - 0.5),
        offset * (noise(p.x * s, p.y * s, 1.0) - 0.5)
      );
      const unit = createVector(0, 1);
      const a = Moremath.roundToMultiple(n.angleBetween(unit), multiple);
      unit.rotate(a).mult(n.mag());
      const next_point = Vector.add(p, unit);
      // const n = p5.Vector.sub(p, next_point);
      new_line.push(next_point);
    }
    return new_line;
  });
}

function d() {
  update();
  background("rgba(20, 20, 20, 0.02)");
  noFill();
  stroke("lightblue");
  strokeWeight(0.05);

  points.forEach((line) => {
    beginShape();
    line.forEach((p) => vertex(p.x, p.y));
    endShape();
  });
}

export const draw = (): void => {
  // d();
};

// Expose the setup/draw functions to the global scope, because
// the entire code will be wrapped in a large IIFE after bundling.
Object.assign(window, { setup, draw });
