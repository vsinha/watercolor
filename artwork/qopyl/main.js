(() => {
  // src/artwork/qopyl/boid.ts
  var speed = 0.1;
  function vectorMean(vecs) {
    if (vecs.length == 0) {
      return createVector(0, 0);
    }
    const sx = vecs.map((v) => v.x).reduce((a, b) => a + b);
    const sy = vecs.map((v) => v.y).reduce((a, b) => a + b);
    return createVector(sx / vecs.length, sy / vecs.length);
  }
  function limitVec(v) {
    if (v.magSq() > 1) {
      v.setMag(1);
    }
    return v;
  }
  var Boid = class {
    constructor(x, y) {
      this.pos = createVector(x, y);
      this.radius = 100;
      this.avoidRadius = 20;
      this.alignRadius = 50;
      this.speed = 1;
      this.velocity = createVector(random(-1, 1), random(-1, 1)).normalize().mult(100);
    }
    draw() {
      stroke("lightblue");
      strokeWeight(4);
      point(this.pos.x, this.pos.y);
      strokeWeight(2);
    }
    getNeighbors(radius, boids2) {
      return boids2.filter((boid) => boid != this && this.pos.dist(boid.pos) < radius);
    }
    vecTowardsCenter(vecs) {
      if (vecs.length == 0) {
        return createVector(0, 0);
      } else {
        return limitVec(vectorMean(vecs).sub(this.pos));
      }
    }
    update(dt, boids2) {
      const center = this.vecTowardsCenter(this.getNeighbors(this.radius, boids2).map((n) => n.pos));
      const avoid = this.vecTowardsCenter(this.getNeighbors(this.avoidRadius, boids2).map((n) => n.pos)).mult(-1);
      const align = this.vecTowardsCenter(this.getNeighbors(this.alignRadius, boids2).map((n) => n.velocity));
      const love = mouseIsPressed ? limitVec(createVector(mouseX, mouseY).sub(this.pos)) : createVector(0, 0);
      const w_center = 3;
      const w_avoid = 10;
      const w_align = 1;
      const w_love = 100;
      const goal = center.mult(w_center).add(avoid.mult(w_avoid)).add(align.mult(w_align)).add(love.mult(w_love)).normalize();
      const mu = 0.1;
      this.velocity.mult(1 - mu).add(goal.mult(mu)).normalize().mult(speed).mult(dt);
      this.pos.add(this.velocity);
    }
  };

  // src/artwork/qopyl/quadtree.ts
  var Quad = class {
    constructor(parent, x, y, width2, height2, depth) {
      this.parent = parent;
      this.depth = depth;
      this.x = x;
      this.y = y;
      this.width = width2;
      this.height = height2;
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
        new Quad(this, x, y, w, h, d),
        new Quad(this, x + w, y, w, h, d),
        new Quad(this, x, y + h, w, h, d),
        new Quad(this, x + w, y + h, w, h, d)
      ];
    }
    contains(point2) {
      return point2.pos.x >= this.x && point2.pos.y >= this.y && point2.pos.x < this.x + this.width && point2.pos.y < this.y + this.height;
    }
    insert(point2) {
      if (this.children.length == 0 && this.points.length < this.maxPoints) {
        this.points.push(point2);
        return;
      }
      if (this.children.length == 0) {
        this.children = this.createSubQuads();
        this.points.forEach((point3) => this.insert(point3));
        this.points = [];
      }
      this.children.forEach((quad) => {
        if (quad.contains(point2)) {
          quad.insert(point2);
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
      }
      this.children.forEach((child) => {
        child.draw();
      });
    }
  };
  var Quadtree = class {
    insert(point2) {
      if (!this.root.contains(point2)) {
        return;
      }
      this.root.insert(point2);
    }
    draw() {
      this.root.draw();
    }
    constructor(x, y, width2, height2, points) {
      this.root = new Quad(void 0, x, y, width2, height2, 0);
      points.forEach((point2) => this.insert(point2));
    }
  };

  // src/artwork/qopyl/main.ts
  var boids = [];
  var showQuadtree = false;
  var setup_ = (width2, height2, showQuadtree_, numBoids) => {
    boids = Array.from({length: numBoids}, () => new Boid(random(0, width2), random(0, height2)));
    showQuadtree = showQuadtree_;
  };
  function mouseClicked() {
    console.log(mouseX, mouseY);
  }
  var setup = () => {
    createCanvas(windowWidth, windowHeight);
    setup_(windowWidth, windowHeight, true, 200);
  };
  var draw_ = (dt) => {
    background("rgba(0, 0, 0, 1)");
    boids.forEach((boid) => boid.update(dt, boids));
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
      const quad = new Quadtree(0, 0, width, height, boids);
      quad.draw();
    }
    boids.forEach((p) => p.draw());
  };
  var draw = () => {
    draw_(deltaTime);
  };
  Object.assign(window, {setup, draw, mouseClicked});
})();
//# sourceMappingURL=main.js.map
