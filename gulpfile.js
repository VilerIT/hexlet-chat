const {
  src,
  dest,
  watch,
  series,
} = require('gulp');
const sass = require('gulp-sass')(require('node-sass'));
const pug = require('gulp-pug');
const svgSprite = require('gulp-svg-sprite');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();

const scripts = () => src([
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/popper.js/dist/umd/popper.min.js',
    './node_modules/bootstrap/dist/js/bootstrap.min.js',
  ])
  .pipe(dest('./build/js/'));

const sass2css = () => src('app/scss/app.scss')
  .pipe(sass())
  .pipe(concat('app.css'))
  .pipe(dest('./build/styles/'))
  .pipe(browserSync.stream());

const pug2html = () => src([
    'app/pages/index.pug',
    'app/pages/chat.pug',
  ])
  .pipe(pug())
  .pipe(dest('./build/'))
  .pipe(browserSync.stream());

const svg2sprite = () => {
  const config = {
    mode: {
      stack: {
        sprite: '../sprite.svg',
      },
    },
  };

  return src([
    'app/images/icons/*.svg',
  ])
    .pipe(svgSprite(config))
    .pipe(dest('./build/images/icons/'));
};

const bootstrapIcons = () => src([
    'node_modules/bootstrap-icons/bootstrap-icons.svg',
  ])
  .pipe(dest('./build/images/icons/'));

const initBrowserSync = () => {
  browserSync.init({
    server: {
      baseDir: './build/',
    },
  });

  watch('./app/scss/**/*.scss', sass2css);
  watch('./app/pages/**/*.pug', pug2html);
};

exports.default = series(
  pug2html,
  sass2css,
  scripts,
  svg2sprite,
  bootstrapIcons,
  initBrowserSync,
);
