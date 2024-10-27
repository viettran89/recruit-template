import gulp from 'gulp';
import pug from 'gulp-pug';
import sass from 'gulp-sass';
import sassCompiler from 'sass';
import browserSync from 'browser-sync';
import babel from 'gulp-babel';
import clean from 'gulp-clean';
import mkdirp from 'fs-extra'; // Use fs-extra instead of gulp-mkdirp

const browserSyncInstance = browserSync.create();
const sassWithDart = sass(sassCompiler);

// Paths
const paths = {
  pug: {
    src: 'src/pug/**/*.pug',
    dest: 'dist/'
  },
  scss: {
    src: 'src/scss/**/*.scss',
    dest: 'dist/css/'
  },
  js: {
    src: 'src/js/**/*.js',
    dest: 'dist/js/'
  },
  img: {
    src: 'src/img/**/*',
    dest: 'dist/img/'
  },
  fonts: {
    src: 'src/fonts/**/*',
    dest: 'dist/fonts/'
  }
};

// Compile Pug to HTML
function compilePug() {
  return gulp.src(paths.pug.src)
    .pipe(pug())
    .pipe(gulp.dest(paths.pug.dest))
    .pipe(browserSyncInstance.stream());
}

// Compile SCSS to CSS
function compileSCSS() {
  return gulp.src(paths.scss.src)
    .pipe(sassWithDart().on('error', sassWithDart.logError))
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(browserSyncInstance.stream({ match: '**/*.css' }));
}
// Compile JavaScript
function compileJS() {
  return gulp.src(paths.js.src)
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(browserSyncInstance.stream());
}

// Clean the images folder
function cleanImages() {
  return gulp.src('dist/img/*', { read: false, allowEmpty: true })
    .pipe(clean());
}

// Copy images
function copyImages() {
  return gulp.src(paths.img.src, { encoding: false })
    .pipe(gulp.dest(paths.img.dest));
}

// Clean and copy images
const processImages = gulp.series(cleanImages, copyImages);

// Clean fonts
function cleanFonts() {
  return gulp.src(paths.fonts.dest, { read: false, allowEmpty: true })
    .pipe(clean());
}

// Create fonts directory if it doesn't exist
function createFontsDirectory(cb) {
  mkdirp.mkdirp(paths.fonts.dest) // Create the directory
    .then(() => cb()) // Call the callback to signal completion
    .catch(err => cb(err)); // Handle errors
}

// Copy fonts
function copyFonts() {
  return gulp.src(paths.fonts.src, { encoding: false })
    .pipe(gulp.dest(paths.fonts.dest));
}

// Clean and copy fonts
const processFonts = gulp.series(createFontsDirectory, cleanFonts, copyFonts);

// Serve and watch for changes
function serve() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });

  gulp.watch(paths.pug.src, compilePug);
  gulp.watch(paths.js.src, compileJS).on('change', browserSync.reload);
  gulp.watch(paths.img.src, processImages).on('change', browserSync.reload);
  gulp.watch(paths.fonts.src, processFonts).on('change', browserSync.reload);
  gulp.watch(paths.scss.src, compileSCSS).on('change', browserSync.reload);
  gulp.watch('./dist/**/*.html').on('change', browserSync.reload);
}

// Default task
const build = gulp.series(
  gulp.parallel(compilePug, compileSCSS, compileJS),
  processImages,
  processFonts,
  serve
);

// Export tasks
export { compilePug, compileSCSS, compileJS, cleanImages, processImages, copyFonts, processFonts, serve, build };
export default build;
