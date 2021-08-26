const { src, dest, watch, series, on } = require('gulp');
const browsersync = require('browser-sync').create();
const concat = require('gulp-concat');
const cssnano = require('cssnano');
const imagemin = require('gulp-imagemin');
const nunjucksRender = require('gulp-nunjucks-render');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const svgmin = require('gulp-svgmin');
const terser = require('gulp-terser');

// Public Folder Task (does not delete files)
function copyPublic(cb) {
  src("src/public/**/*")
    .pipe(dest("dist"));
  cb();
 }

// Nunjucks Task
function nunjucksTask(cb) {
  src("src/pages/**/*.html")
    .pipe(
      nunjucksRender({
        path: ["src/templates", "src/partials"]
      })
    )
    .pipe(dest("dist"));
  cb();
}

// Sass Task
function scssTask() {
  return src('src/scss/*.scss', { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([cssnano()]))
    .pipe(dest('dist', { sourcemaps: '.' }));
}

// JavaScript Task
function jsTask() {
  return src('src/js/*.js', { sourcemaps: true })
    .pipe(concat('main.js'))
    .pipe(terser())
    .pipe(dest('dist', { sourcemaps: '.' }));
}

// Image Task
function imageTask() {
  return src('src/images/*')
    .pipe(imagemin())
    .pipe(dest('dist/images'));
}

// Image Properties Task
function imagePropertiesTask() {
  return src('src/images-properties/*')
    .pipe(imagemin())
    .pipe(dest('dist/images-properties'));
}

// Image Properties Task
function imagePlacesTask() {
  return src('src/images-places/*')
    .pipe(imagemin())
    .pipe(dest('dist/images-places'));
}

// Browsersync Tasks
function browsersyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: 'dist'
    }
  });
  cb();
}

function browsersyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask() {
  watch('src/public/**/*', series(copyPublic, browsersyncReload));
  watch(['src/**/*.html', 'src/**/*.njk'], series(nunjucksTask, browsersyncReload));
  watch('src/scss/**/*.scss', series(scssTask, browsersyncReload));
  watch('src/js/**/*.js', series(jsTask, browsersyncReload));
  watch('src/images/*', series(imageTask, browsersyncReload));
  watch('src/images-places/*', series(imagePlacesTask, browsersyncReload));
  watch('src/images-properties/*', series(imagePropertiesTask, browsersyncReload));
}

// Default Gulp Task
exports.default = series(
  copyPublic,
  nunjucksTask,
  scssTask,
  jsTask,
  imageTask,
  imagePlacesTask,
  imagePropertiesTask,
  browsersyncServe,
  watchTask
);
