import { Vector } from "p5";

export interface IPosition {
  pos: Vector;
}

class Quad<T extends IPosition> {
  x: number;
  y: number;
  width: number;
  height: number;

  depth: number;
  parent: Quad<T> | undefined;
  children: Quad<T>[];
  points: T[];
  maxPoints: number;

  constructor(
    parent: Quad<T> | undefined,
    x: number,
    y: number,
    width: number,
    height: number,
    depth: number
  ) {
    this.parent = parent;
    this.depth = depth;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.children = [];
    this.points = [];
    this.maxPoints = 4;
  }

  createSubQuads() {
    const w = this.width / 2;
    const h = this.height / 2;
    const x = this.x;
    const y = this.y;

    const d = this.depth + 1;
    return [
      new Quad<T>(this, x, y, w, h, d),
      new Quad<T>(this, x + w, y, w, h, d),
      new Quad<T>(this, x, y + h, w, h, d),
      new Quad<T>(this, x + w, y + h, w, h, d),
    ];
  }

  contains(point: T) {
    return (
      point.pos.x >= this.x &&
      point.pos.y >= this.y &&
      point.pos.x < this.x + this.width &&
      point.pos.y < this.y + this.height
    );
  }

  insert(point: T) {
    if (this.children.length == 0 && this.points.length < this.maxPoints) {
      this.points.push(point);
      return;
    }

    if (this.children.length == 0) {
      this.children = this.createSubQuads();

      // when we create children we should move any points
      // in us (the now-parent) to the children
      this.points.forEach((point) => this.insert(point));
      this.points = [];
    }

    this.children.forEach((quad) => {
      if (quad.contains(point)) {
        quad.insert(point);
      }
    });
  }

  draw() {
    if (this.depth > 2 && this.points.length > 0) {
      stroke("gray");
      strokeWeight(0.2);
      noFill();

      beginShape();
      vertex(this.x, this.y);
      vertex(this.x + this.width, this.y);
      vertex(this.x + this.width, this.y + this.height);
      vertex(this.x, this.y + this.height);
      endShape(CLOSE);

      // strokeWeight(5);
      // this.points.forEach((p) => point(p.pos.x, p.pos.y));
    }

    this.children.forEach((child) => {
      child.draw();
    });
  }
}

export class Quadtree<T extends IPosition> {
  root: Quad<T>;

  insert(point: T): void {
    if (!this.root.contains(point)) {
      return;
    }

    this.root.insert(point);
  }

  draw(): void {
    this.root.draw();
  }

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    points: T[]
  ) {
    this.root = new Quad<T>(undefined, x, y, width, height, 0);
    points.forEach((point) => this.insert(point));
  }
}
