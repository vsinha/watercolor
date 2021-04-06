let esbuild = require("esbuild");
let path = require("path");
let fs = require("fs");
const { info } = require("console");

let mode = process.argv[2] ? process.argv[2] : "dev";

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

function copyStaticFiles(from, to) {
  let html = findFilesInDir(from, ".html");
  let css = findFilesInDir(from, ".css");
  let files = html.concat(css);
  for (let file of files) {
    // let source = files[i];
    let destination = file.replace(from, to);
    fs.copyFile(file, destination, (err) => {
      if (err) throw err;
      console.log(file + " was copied to " + destination);
    });
  }
}

let entryPoints = findFilesInDir("./", "main.ts");

console.log("Found entrypoints: ", entryPoints);

let to = "./build";
const settings = {
  entryPoints,
  bundle: true,
  outdir: to,
  watch: true,
  sourcemap: true,
  minify: false,
  logLevel: "info",

  // loader: { ".html": "file", ".css": "file" },
};

if (mode == "prod") {
  to = "./dist";
  settings.minify = true;
  settings.watch = false;
  settings.sourcemap = false;
  settings.outdir = to;
}
esbuild.build(settings).then(() => copyStaticFiles("src", to));
