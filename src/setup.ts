import p5 from "p5";

const num_points = 200;
let lines: p5.Vector[][] = [];

const new_random_point = (width: number, height: number) =>
  createVector(random(0, width), random(0, height));

export const setup = (): void => {
  createCanvas(windowWidth, windowHeight);

  lines = Array.from({ length: num_points }, (_x, _i) => [
    new_random_point(windowWidth, windowHeight),
  ]);
};

function update() {
  // noiseDetail(8, 0.7).;

  const s = 0.01;
  const offset = 100;
  for (let j = 0; j < lines.length; j++) {
    lines[j] = [];
    lines[j].push(new_random_point(windowWidth, windowHeight));
    for (let i = 0; i < 10; i++) {
      const p = lines[j][i];
      const new_vec = createVector(p?.x, p?.y);
      const offset_x = offset * (noise(p.x * s, p.y * s, 0.0) - 0.5);
      const offset_y = offset * (noise(p.x * s, p.y * s, 1.0) - 0.5);
      new_vec.add(offset_x, offset_y);
      lines[j].push(new_vec);
    }
  }
}

export const draw = (): void => {
  update();
  background("rgba(255, 255, 255, 0.01)");
  noFill();
  stroke("purple"); // Change the color
  strokeWeight(1); // Make the points 10 pixels in size

  lines.forEach((line) => {
    beginShape();
    line.forEach((p) => {
      curveVertex(p.x, p.y);
    });

    endShape();
  });
};
