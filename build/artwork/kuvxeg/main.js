(() => {
  // src/artwork/kuvxeg/main.ts
  var num_points = 200;
  var lines = [];
  var new_random_point = (width, height) => createVector(random(0, width), random(0, height));
  var setup = () => {
    createCanvas(windowWidth, windowHeight);
    lines = Array.from({length: num_points}, () => [
      new_random_point(windowWidth, windowHeight)
    ]);
    background("black");
  };
  function update() {
    const s = 0.01;
    const offset = 100;
    lines = lines.map(() => {
      const new_line = [new_random_point(windowWidth, windowHeight)];
      for (let i = 0; i < 10; i++) {
        const p = new_line[i] || createVector(0, 0);
        const new_vec = createVector(p?.x, p?.y);
        new_vec.add(offset * (noise(p.x * s, p.y * s, 0) - 0.5), offset * (noise(p.x * s, p.y * s, 1) - 0.5));
        new_line.push(new_vec);
      }
      return new_line;
    });
  }
  var draw = () => {
    update();
    background("rgba(10, 10, 10, 0.01)");
    noFill();
    stroke("lightblue");
    strokeWeight(1);
    lines.forEach((line) => {
      beginShape();
      line.forEach((p) => curveVertex(p.x, p.y));
      endShape();
    });
  };
  Object.assign(window, {setup, draw});
})();
//# sourceMappingURL=main.js.map
