import { Shape } from "./shape.js";

const shapes: Shape[] = [];

export const setup = (): void => {
  createCanvas(windowWidth, windowHeight);

  const center = createVector(windowWidth / 2, windowHeight / 2);
  const radius = windowHeight / 10;
  const num_points = 6;

  const base = Shape.create(center, radius, num_points, 0.1);
  for (let i = 0; i < 7; i++) {
    base.permute();
  }
  shapes.push(base);

  const layers = 50;
  for (let l = 0; l < layers; l++) {
    const layer = base.clone();
    layer.alpha = 0.03;
    for (let l = 0; l < 3; l++) {
      layer.permute();
    }
    shapes.push(layer);
  }

  background("rgba(255, 255, 255, 1)");
  noStroke();

  shapes.forEach((s: Shape) => {
    fill(`rgba(146, 23, 178, ${s.alpha})`);
    beginShape();
    s.points.forEach((point) => vertex(point.x, point.y));
    endShape(CLOSE);
  });
};

export const draw = (): void => {
  // update();
};
