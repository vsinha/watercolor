import p5, { Vector } from "p5";
import { IPosition, Quadtree } from "./quadtree.js";

const num_points = 200;
const speed = 1;
let boids: Boid[] = [];

function vectorMean(vecs: Vector[]): Vector {
  if (vecs.length == 0) {
    return createVector(0, 0);
  }
  const sx = vecs.map((v) => v.x).reduce((a, b) => a + b);
  const sy = vecs.map((v) => v.y).reduce((a, b) => a + b);
  return createVector(sx / vecs.length, sy / vecs.length);
}

function limitVec(v: Vector) {
  if (v.magSq() > 1) {
    v.setMag(1);
  }
  return v;
}

class Boid implements IPosition {
  pos: Vector;
  velocity: Vector;
  radius: number;
  avoidRadius: number;
  alignRadius: number;
  speed: number;

  constructor(x: number, y: number) {
    this.pos = createVector(x, y);
    this.radius = 100;
    this.avoidRadius = 20;
    this.alignRadius = 50;
    this.speed = 1;
    this.velocity = createVector(random(-1, 1), random(-1, 1))
      .normalize()
      .mult(speed);
  }

  draw() {
    stroke("lightblue");
    strokeWeight(4);
    point(this.pos.x, this.pos.y);

    strokeWeight(2);

    const dir = Vector.mult(this.velocity, 10);
    line(this.pos.x, this.pos.y, this.pos.x + dir.x, this.pos.y + dir.y);
  }

  getNeighbors(radius: number, boids: Boid[]) {
    // CR vsinha: add viewing angle
    return boids.filter(
      (boid) => boid != this && this.pos.dist(boid.pos) < radius
    );
  }

  vecTowardsCenter(vecs: Vector[]) {
    if (vecs.length == 0) {
      return createVector(0, 0);
    } else {
      return limitVec(vectorMean(vecs).sub(this.pos));
    }
  }

  update(boids: Boid[]) {
    // cohesion
    const center = this.vecTowardsCenter(
      this.getNeighbors(this.radius, boids).map((n) => n.pos)
    );

    // separation
    const avoid = this.vecTowardsCenter(
      this.getNeighbors(this.avoidRadius, boids).map((n) => n.pos)
    ).mult(-1);

    const align = this.vecTowardsCenter(
      this.getNeighbors(this.alignRadius, boids).map((n) => n.velocity)
    );

    const love = mouseIsPressed
      ? limitVec(createVector(mouseX, mouseY).sub(this.pos))
      : createVector(0, 0);

    const w_center = 3;
    const w_avoid = 10;
    const w_align = 1;
    const w_love = 100;
    const goal = center
      .mult(w_center)
      .add(avoid.mult(w_avoid))
      .add(align.mult(w_align))
      .add(love.mult(w_love))
      .normalize();

    const mu = 0.1;
    this.velocity
      .mult(1 - mu)
      .add(goal.mult(mu))
      .normalize();

    this.pos.add(this.velocity);
  }
}

export const setup_sized = (width: number, height: number): void => {
  boids = Array.from(
    { length: num_points },
    () => new Boid(random(0, width), random(0, height))
  );
};

export function mouseClicked(): void {
  console.log(mouseX, mouseY);
}

export const setup = (): void => {
  createCanvas(windowWidth, windowHeight);
  setup_sized(windowWidth, windowHeight);
};

export const draw = (): void => {
  background("rgba(0, 0, 0, 1)");
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
  boids.forEach((boid) => boid.update(boids));

  const quad = new Quadtree<Boid>(0, 0, width, height, boids);
  quad.draw();

  boids.forEach((p) => p.draw());
};

// Expose the setup/draw functions to the global scope, because
// the entire code will be wrapped in a large IIFE after bundling.
Object.assign(window, { setup, draw, mouseClicked });
