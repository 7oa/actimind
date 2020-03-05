var gulp = require("gulp"),
  connect = require("gulp-connect"),
  opn = require("opn"),
  sass = require("gulp-sass"),
  pug = require("gulp-pug"),
  rimraf = require("rimraf"),
  uglify = require("gulp-uglify-es").default,
  autoprefixer = require("gulp-autoprefixer"),
  cssmin = require("gulp-cssmin"),
  watch = require("gulp-watch"),
  rigger = require("gulp-rigger"),
  cache = require("gulp-cache"),
  browserSync = require("browser-sync"),
  pugbem = require("gulp-pugbem"),
  babel = require("gulp-babel"),
  imagemin = require("gulp-imagemin"),
  pngquant = require("imagemin-pngquant");

var dest_path = "public";
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

gulp.task("pug", function() {
  gulp
    .src("app/templates/*.pug")
    .pipe(pug({ pretty: true, plugins: [pugbem] }))
    .on("error", log)
    .pipe(gulp.dest(dest_path + "/"))
    .pipe(browserSync.stream());
});

var autoprefixerOptions = {
  overrideBrowserslist: ["> 1%", "ie 11"]
};

gulp.task("sass", function() {
  gulp
    .src("app/scss/style.scss")
    .pipe(
      sass().on("error", function(error) {
        console.log(error);
      })
    )
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(cssmin())
    .pipe(gulp.dest(dest_path))
    .pipe(browserSync.stream());
});

gulp.task("js", function() {
  gulp
    .src("app/js/script.js")
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
    .pipe(gulp.dest(dest_path + "/js/"))
    .pipe(browserSync.stream());
});

gulp.task("image", function() {
  gulp
    .src("./app/img/**/*.*")
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
    .pipe(gulp.dest(dest_path + "/img/"))
    .pipe(browserSync.stream());
});

gulp.task("build", ["pug", "sass", "js", "image"]);

gulp.task("clean", function(cb) {
  rimraf(dest_path, cb);
});

gulp.task("clearcache", function() {
  return cache.clearAll();
});

gulp.task("watch", function() {
  watch(["./app/img/**/*.*"], function(event, cb) {
    gulp.start("image");
  });
  watch(["./app/templates/**/*.pug"], function(event, cb) {
    gulp.start("pug");
  });
  watch(["./app/scss/**/*.scss"], function(event, cb) {
    setTimeout(function() {
      gulp.start("sass");
    }, 500);
  });
  watch(["./app/js/**/*.js"], function(event, cb) {
    gulp.start("js");
  });
});

gulp.task("serv_livereload", function() {
  connect.server({
    root: dest_path,
    livereload: true,
    port: 8888
  });
  opn("http://localhost:8888");
});

browserSync.create();
gulp.task("server", function() {
  browserSync.init({
    server: dest_path,
    browser: "chrome",
    notify: false
  });
});

gulp.task("default", ["server", "watch"]);
