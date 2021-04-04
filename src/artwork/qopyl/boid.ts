import { Vector } from "p5";
import { IPosition } from "./quadtree.js";

const speed = 0.1;

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

export class Boid implements IPosition {
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
      .mult(100);
  }

  draw(): void {
    stroke("lightblue");
    strokeWeight(4);
    point(this.pos.x, this.pos.y);

    strokeWeight(2);

    // const dir = Vector.mult(this.velocity, 10);
    // line(this.pos.x, this.pos.y, this.pos.x + dir.x, this.pos.y + dir.y);
  }

  private getNeighbors(radius: number, boids: Boid[]) {
    // CR vsinha: add viewing angle
    return boids.filter(
      (boid) => boid != this && this.pos.dist(boid.pos) < radius
    );
  }

  private vecTowardsCenter(vecs: Vector[]) {
    if (vecs.length == 0) {
      return createVector(0, 0);
    } else {
      return limitVec(vectorMean(vecs).sub(this.pos));
    }
  }

  update(dt: number, boids: Boid[]): void {
    const center = this.vecTowardsCenter(
      this.getNeighbors(this.radius, boids).map((n) => n.pos)
    );

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
      .normalize()
      .mult(speed)
      .mult(dt);

    this.pos.add(this.velocity);
  }
}
