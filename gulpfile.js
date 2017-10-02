'use strict';

const gulp = require('gulp');
const del = require('del');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const debug = require('gulp-debug');
const gutil = require( 'gulp-util' );
const ftp = require( 'vinyl-ftp' );
const ftpData = require('./ftpData');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const newer = require('gulp-newer');
const imagemin = require('gulp-imagemin');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const eslint = require('gulp-eslint');
const through2 = require('through2');
const fs = require('fs');
const combiner = require('stream-combiner2').obj;
const remember = require('gulp-remember');
const sassInheritance = require('gulp-sass-multi-inheritance');
const cached = require('gulp-cached');
const critical = require('critical').stream;

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
const pathNames = {
  src: {
    assets: [
      'src/assets/fonts/**/*.*',
      'src/assets/mail/**/*.*',
      'src/*.*',
      'src/.htaccess'
      ],
    img: ['src/assets/img/**/*.+(gif|png|jpg|jpeg)', 'src/assets/service_img/**/*.+(gif|png|jpg|jpeg)'],
    css: ['src/css/**/*.css'],
    sass: ['src/css/**/*.scss'],
    js: ['src/js/**/*.js',]
  }
};
const dest = 'dist';
const base = "src";


gulp.task('clean', () => {
  console.log(isDevelopment);
  console.log(process.env.NODE_ENV);
  return del(dest);
});

gulp.task('critical', () => {
  return gulp.src(dest + '/*.html')
    .pipe(critical({
      inline: true,
      base: dest,
      css: [
        dest + '/css/normalize.css',
        dest + '/css/styles.css',
        dest + '/css/jquery.mmenu.css',
        dest + '/css/jquery.mmenu.themes.css',
        dest + '/css/slick.css',
        dest + '/css/slick-theme.css',
      ],
     /* src: 'index.html',
      dest: 'index.html',*/
      minify: false,
      include: [
        '#m-menu:not(.mm-menu)',
        '.mm-menu.mm-offcanvas'
      ],
      dimensions: [{
        width: 1366,
        height: 900,
      }, {
        width: 700,
        height: 500,
      }]
    }))
    .pipe(gulp.dest(dest));

  /*return critical.generate({
          inline: true,
          base: './dist/',
          css: [
            'dist/css/normalize.css',
            'dist/css/styles.css',
            'dist/css/jquery.mmenu.css',
            'dist/css/jquery.mmenu.themes.css',
            'dist/css/slick.css',
            'dist/css/slick-theme.css',
          ],
          src: 'index.html',
          dest: 'index.html',
          minify: true,
          include: [
            '#m-menu:not(.mm-menu)',
            '.mm-menu.mm-offcanvas'
          ],
          dimensions: [{
            width: 1366,
            height: 900,
          }, {
            width: 700,
            height: 500,
          }]
        });*/
});

gulp.task('lint', () => {
  return gulp.src(pathNames.src.js);
});

gulp.task('assets', () => {
  return gulp.src(pathNames.src.assets, {base: base, since: gulp.lastRun('assets')})
    /*.on('data', (file) => {
      console.log({
        contents: file.contents,
        path: file.path,
        cwd: file.cwd,
        base: file.base,
        relative: file.relative,
        dirname: file.dirname,
        basename: file.basename,
        stem: file.stem,
        extname: file.extname
      });
      //console.dir(file);
    })*/
    .pipe(newer(dest))
    //.pipe(debug({title: 'assets'}))
    .pipe(gulp.dest(dest));
});

gulp.task('img', () => {
    return gulp.src(pathNames.src.img, {base: base, since: gulp.lastRun('img')})
      .pipe(newer(dest))
      //.pipe(debug({title: 'img:start'}))
      .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.jpegtran({progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({plugins: [{removeViewBox: true}]})
      ],
      {
        verbose: true
      }))
    //.pipe(debug({title: 'img:output'}))
    .pipe(gulp.dest(dest));
});

gulp.task('css', () => {
  return gulp.src(pathNames.src.css, {base: base, since: gulp.lastRun('css')})
    .pipe(newer(dest))
    .pipe(cleanCSS({rebaseTo: ''}))
    .pipe(gulp.dest(dest));
});

gulp.task('sass', () => {
  return gulp.src(pathNames.src.sass, {base: base/*, since: gulp.lastRun('sass:lib')*/})
    //.pipe(newer(dest))
    .pipe(debug({title: 'sass:lib'}))
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    //.pipe(remember('sass:lib'))
    .pipe(sass().on('error', notify.onError()))
    .pipe(cleanCSS({rebaseTo: ''}))
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulp.dest(dest));
    //.pipe(debug({title: 'sass:lib:output'}));
});

gulp.task('sass:theme', () => {
  return gulp.src(pathNames.src.sassTheme, {base: base, since: gulp.lastRun('sass:theme')})
    //.pipe(newer(dest))
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({rebaseTo: ''}))
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulp.dest(dest));
});

gulp.task('js', () => {
  return gulp.src(pathNames.src.js, {base: base, since: gulp.lastRun('js')})
    .pipe(newer(dest))
    //.pipe(debug({title: 'js'}))
    .pipe(eslint({
      configFile: 'eslint.json'/*,
      globals: [
        'jQuery',
        '$'
      ]*/
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(gulpIf(!isDevelopment, uglify()))
    /*.pipe(rename((path) => {
      let pattern = '.min';

      if (~path.basename.indexOf(pattern)) return;

      path.basename += pattern;
    }))*/
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulp.dest(dest));
});

gulp.task('ftp', () => {
  let conn = ftp.create({
    host: ftpData.host,
    user: ftpData.user,
    pass: ftpData.pass,
    parallel: 5,
    log: gutil.log
  });
  let globs = ['dist/**/*.*', '!dist/bindex.html'];

  return gulp.src(globs, {base: dest, buffer: false})
    .pipe(conn.newer('/'))
    .pipe(conn.dest('/'));
});

gulp.task('watch', () => {
  gulp.watch(pathNames.src.assets, gulp.series('assets', 'critical'));

  gulp.watch(pathNames.src.css, gulp.series('css', 'critical'));
  //gulp.watch(pathNames.src.cssFonts, gulp.series('css:fonts'));

  //gulp.watch('dev/css/**/*.scss', gulp.series('sass:lib'));
  gulp.watch(pathNames.src.sass, gulp.series('sass', 'critical'));

  gulp.watch(pathNames.src.js, gulp.series('js'));
  //gulp.watch(pathNames.src.jsES6, gulp.series('js:ES6'));
});



gulp.task('build', gulp.series('clean', 'assets', 'img', 'css', 'sass', 'js', 'critical'));

gulp.task('default', gulp.series('build'));

gulp.task('dev', gulp.series('build', 'watch'));

gulp.task('deploy', gulp.series('build', 'ftp'));



