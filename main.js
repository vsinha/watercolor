(()=>{var h=200,t=[],c=(o,e)=>createVector(random(0,o),random(0,e)),d=()=>{createCanvas(windowWidth,windowHeight),t=Array.from({length:h},(o,e)=>[c(windowWidth,windowHeight)])};function f(){let o=.01,e=100;for(let n=0;n<t.length;n++){t[n]=[],t[n].push(c(windowWidth,windowHeight));for(let i=0;i<10;i++){let r=t[n][i],s=createVector(r?.x,r?.y),p=e*(noise(r.x*o,r.y*o,0)-.5),w=e*(noise(r.x*o,r.y*o,1)-.5);s.add(p,w),t[n].push(s)}}}var a=()=>{f(),background("rgba(255, 255, 255, 0.01)"),noFill(),stroke("purple"),strokeWeight(1),t.forEach(o=>{beginShape(),o.forEach(e=>{curveVertex(e.x,e.y)}),endShape()})};Object.assign(window,{setup:d,draw:a});})();
//# sourceMappingURL=main.js.map