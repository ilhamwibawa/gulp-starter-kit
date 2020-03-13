const { src, dest, parallel, series, watch } = require('gulp')
const sass = require('gulp-sass')
const browserSync = require('browser-sync').create()
const useref = require('gulp-useref')
const uglify = require('gulp-uglify')
const gulpIf = require('gulp-if')
const imagemin = require('gulp-imagemin')
const cache = require('gulp-cache')
const del = require('del')
const cssnano = require('gulp-cssnano')

function styles(done) {
  src('src/scss/**/*.scss')
    .pipe(sass())
    .pipe(dest('src/css'))
    .pipe(browserSync.stream())
  done()
}

function browserReload() {
  return browserSync.reload
}

function bs() {
  browserSync.init({
    server: {
      baseDir: 'src',
    },
  })

  watch('src/scss/**/*.scss', styles)
  watch('src/*.html').on('change', browserReload())
  watch('src/js/**/*.js').on('change', browserReload())
}

function userefTask() {
  return src('./src/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(dest('dist'))
}

function images() {
  return src('app/images/**/*.+(png|jpg|gif|svg)')
    .pipe(
      cache(
        imagemin({
          interlaced: true,
        })
      )
    )
    .pipe(dest('dist/images'))
}

function fonts() {
  return src('src/fonts/**/*').pipe(dest('dist/fonts'))
}

function clean(done) {
  del.sync('dist')
  done()
}

exports.default = parallel(styles, bs)
exports.build = parallel(clean, styles, userefTask, images, fonts)
exports.clean = clean
