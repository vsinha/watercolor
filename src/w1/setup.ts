import p5 from "p5";

interface Shape {
  points: p5.Vector[];
  alpha: number;
}

const shapes: Shape[] = [];

function polygon(center: p5.Vector, radius: number, num_points: number) {
  const angle = TWO_PI / num_points;
  return Array.from({ length: num_points }, (x, i) =>
    createVector(radius * cos(i * angle), radius * sin(i * angle)).add(center)
  );
}

// function pairwise_array(array) {
//   const acc = [];
//   for (let i = 0; i < array.length - 1; i++) {
//     acc.push(i, array[i], array[i + 1]);
//   }
//   acc.push(array.length, array[array.length - 1], array[0]);
//   return acc;
// }

function pairwise<T>(
  array: Array<T>,
  func: (index: number, a: T, b: T) => void
) {
  for (let i = 0; i < array.length - 1; i++) {
    func(i, array[i], array[i + 1]);
  }
  func(array.length, array[array.length - 1], array[0]);
}

function permute(shape: Shape): Shape {
  const new_points: p5.Vector[] = [];
  pairwise(shape.points, (index, a: p5.Vector, b: p5.Vector) => {
    new_points.push(a);
    const dist = a.dist(b);
    const push_distance = random(0, dist);
    if (dist == 0) {
      return;
    }
    const unit = p5.Vector.sub(a, b)
      .rotate(randomGaussian(-HALF_PI, PI))
      .div(dist)
      .mult(push_distance);
    const m = createVector((a.x + b.x) / 2, (a.y + b.y) / 2).add(unit);
    new_points.push(m);
    new_points.push(b);
  });
  return { points: new_points, alpha: shape.alpha };
}

export const setup = (): void => {
  createCanvas(windowWidth, windowHeight);

  const center = createVector(windowWidth / 2, windowHeight / 2);
  const radius = 100;
  const num_points = 10;

  let base = { points: polygon(center, radius, num_points), alpha: 0.5 };
  for (let i = 0; i < 7; i++) {
    base = permute(base);
  }

  const layers = 70;
  for (let l = 0; l < layers; l++) {
    let layer = permute(base);
    layer.alpha = 0.02;
    for (let l = 0; l < 4; l++) {
      layer = permute(layer);
    }
    shapes.push(layer);
  }

  background("rgba(255, 255, 255, 1)");
  noStroke();

  shapes.forEach((shape) => {
    fill(`rgba(146, 23, 178, ${shape.alpha})`);
    beginShape();
    shape.points.forEach((point) => vertex(point.x, point.y));
    endShape(CLOSE);
  });
};

// function update() {}

export const draw = (): void => {
  // update();
};
