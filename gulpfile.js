const gulp = require('gulp');
const less = require('gulp-less');
const packs = require('./utils/packs.js');
const css = require('./utils/css.js');

exports.default = gulp.series(
  gulp.parallel(css.compile),
  css.watchUpdates
);
exports.css = css.compile;
exports.compilePacks = gulp.series(packs.compile);

