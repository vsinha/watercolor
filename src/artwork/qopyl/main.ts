import { Boid } from "./boid.js";
import { Quadtree } from "./quadtree.js";

let boids: Boid[] = [];
let showQuadtree = false;

export const setup_sized = (
  width: number,
  height: number,
  showQuadtree_: boolean,
  numBoids: number
): void => {
  boids = Array.from(
    { length: numBoids },
    () => new Boid(random(0, width), random(0, height))
  );

  showQuadtree = showQuadtree_;
};

export function mouseClicked(): void {
  console.log(mouseX, mouseY);
}

export const setup = (): void => {
  createCanvas(windowWidth, windowHeight);
  setup_sized(windowWidth, windowHeight, true, 200);
};

export const draw = (): void => {
  background("rgba(0, 0, 0, 1)");

  boids.forEach((boid) => boid.update(boids));

  // torus
  boids.forEach((b) => {
    if (b.pos.x < 0) {
      b.pos.x = width;
    } else if (b.pos.x >= width) {
      b.pos.x = 0;
    }
    if (b.pos.y < 0) {
      b.pos.y = height;
    } else if (b.pos.y >= height) {
      b.pos.y = 0;
    }
  });

  if (showQuadtree) {
    const quad = new Quadtree<Boid>(0, 0, width, height, boids);
    quad.draw();
  }

  boids.forEach((p) => p.draw());
};

// Expose the setup/draw functions to the global scope, because
// the entire code will be wrapped in a large IIFE after bundling.
Object.assign(window, { setup, draw, mouseClicked });
