const { src, dest, parallel, series, watch } = require("gulp");
const sass = require("gulp-sass");
const pug = require("gulp-pug");
const rimraf = require("rimraf");
const uglify = require("gulp-uglify-es").default;
const autoprefixer = require("gulp-autoprefixer");
const cssmin = require("gulp-cssmin");
const rigger = require("gulp-rigger");
const cache = require("gulp-cache");
const browserSync = require("browser-sync").create();
const pugbem = require("gulp-pugbem");
const babel = require("gulp-babel");
const imagemin = require("gulp-imagemin");
const pngquant = require("imagemin-pngquant");

const dest_path = "public";
pugbem.m = "--";

function log(error) {
  console.log(
    [
      "",
      "----------ERROR MESSAGE START----------",
      "[" + error.name + " in " + error.plugin + "]",
      error.message,
      "----------ERROR MESSAGE END----------",
      ""
    ].join("\n")
  );
  this.end();
}

function html() {
  return src("app/templates/*.pug")
    .pipe(pug({ pretty: true, plugins: [pugbem] }))
    .on("error", log)
    .pipe(dest(`${dest_path}/`))
    .pipe(browserSync.stream());
}

function css() {
  return src("app/scss/style.scss")
    .pipe(
      sass().on("error", function(error) {
        console.log(error);
      })
    )
    .pipe(sass().on("error", sass.logError))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["> 1%", "ie 11"]
      })
    )
    .pipe(cssmin())
    .pipe(dest(dest_path))
    .pipe(browserSync.stream());
}

function js() {
  return src("app/js/script.js", { sourcemaps: true })
    .pipe(rigger())
    .pipe(
      babel({
        presets: [
          [
            "@babel/preset-env",
            {
              targets: "> 1%, not dead"
            }
          ]
        ]
      })
    )
    .pipe(uglify())
    .pipe(dest(`${dest_path}/js/`, { sourcemaps: true }))
    .pipe(browserSync.stream());
}
function img() {
  return src("./app/img/**/*.*")
    .pipe(
      cache(
        imagemin({
          progressive: true,
          svgoPlugins: [{ removeViewBox: false }],
          use: [pngquant()],
          interlaced: true
        })
      )
    )
    .pipe(dest(`${dest_path}/img/`))
    .pipe(browserSync.stream());
}

function server() {
  browserSync.init({
    server: dest_path,
    browser: "chrome",
    notify: false
  });
}

function watcher() {
  server();
  watch("./app/img/**/*.*", img);
  watch("./app/templates/**/*.pug", html);
  watch("./app/scss/**/*.scss", css);
  watch("./app/js/**/*.js", js);
}

function clean(cb) {
  return rimraf(dest_path, cb);
}

exports.js = js;
exports.css = css;
exports.html = html;
exports.img = img;
exports.server = server;
exports.watcher = watcher;
exports.build = series(clean, parallel(html, css, js, img));
exports.default = watcher;
