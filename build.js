let esbuild = require("esbuild");
let path = require("path");
let fs = require("fs");
const { info } = require("console");

function findFilesInDir(startPath, filter) {
  var results = [];

  if (!fs.existsSync(startPath)) {
    console.log("no dir ", startPath);
    return;
  }

  var files = fs.readdirSync(startPath);
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(startPath, files[i]);
    var stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      results = results.concat(findFilesInDir(filename, filter));
    } else if (filename.indexOf(filter) >= 0) {
      results.push(filename);
    }
  }
  return results;
}

let entryPoints = findFilesInDir("./", "main.ts");

console.log("Found entrypoints: ", entryPoints);

esbuild.build({
  entryPoints,
  bundle: true,
  outdir: "./dist/",
  watch: true,
  sourcemap: true,
  logLevel: "info",
});
