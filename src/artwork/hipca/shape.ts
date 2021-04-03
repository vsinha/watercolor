import { Vector } from "p5";

function polygon(center: Vector, radius: number, num_points: number) {
  const angle = TWO_PI / num_points;
  return Array.from({ length: num_points }, (x, i) =>
    createVector(radius * cos(i * angle), radius * sin(i * angle)).add(center)
  );
}

function gaussianRand() {
  let rand = 0;
  for (let i = 0; i < 3; i += 1) {
    rand += Math.random();
  }
  return rand / 3;
}

function midpoint(a: Vector, b: Vector) {
  const dist = a.dist(b);
  // For js reasons, p5js's random is slower than the builtin one
  const push_distance = Math.random() * dist;
  const unit = Vector.sub(a, b)
    .normalize()
    .rotate(gaussianRand() * PI)
    .mult(push_distance);
  return createVector((a.x + b.x) / 2, (a.y + b.y) / 2).add(unit);
}

export class Shape {
  points: Vector[];
  alpha: number;

  constructor(points: Vector[], alpha: number) {
    this.points = points;
    this.alpha = alpha;
  }

  static create(
    center: Vector,
    radius: number,
    num_points: number,
    alpha: number
  ): Shape {
    const points = polygon(center, radius, num_points);
    return new Shape(points, alpha);
  }

  clone(): Shape {
    return new Shape([...this.points], this.alpha);
  }

  permute(): void {
    const len = this.points.length;
    const newPoints: Vector[] = [];
    for (let i = 0; i < len; i++) {
      const a = this.points[i];
      const b = this.points[i + 1 == this.points.length ? 0 : i + 1];
      newPoints.push(midpoint(a, b));
    }

    // splice the array of midpoints into the original array
    for (let i = 0; i < len; i++) {
      this.points.splice(i * 2 + 1, 0, newPoints[i]);
    }
  }
}
