const {src, dest, watch, parallel, series} = require('gulp')
const concat = require('gulp-concat')
const scss = require('gulp-sass')(require('sass'))
const uglify = require('gulp-uglify-es').default
const browserSync = require('browser-sync').create()
const autoprefixer = require('gulp-autoprefixer')
const clean = require('gulp-clean')


function styles() {
    return src('app/scss/style.scss')
        .pipe(autoprefixer({overrideBrowserslist: ['last 10 version']}))
        //Объединяет файлы.
        .pipe(concat('style.min.css'))
        //конвертация кода из SASS в CSS.
        .pipe(scss({outputStyle: 'compressed'}))
        //выкидывает  файл в новую папку.
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

function scripts() {
    return src([
        // 'node_modules/swiper/swiper-bundle.js',
        'app/js/main.js',
        // "app/js/*.js",
        // '!app/js/main.min.js'
    ])
        .pipe(concat('main.min.js'))
        //сжимает js файлы.
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}

function watching() {
    //следит за изменениями.
    watch(['app/scss/style.scss'], styles)
    watch(['app/js/main.js'], scripts)
    watch(['app/*.html']).on('change', browserSync.reload)
}

function browsersync() {
    // отслеживает изменения в исходных файлах и скриптах без перезагрузки веб-страницы.
    browserSync.init({
        server: {
            baseDir: 'app/'
        }
    })
}

function cleanDist (){
    return src('dist')
        .pipe(clean())
}

function building() {
    return src([
        'app/css/style.min.css',
        'app/js/main.min.js',
        'app/**/*.html'
    ], {base: 'app'})
        .pipe(dest('dist'))
}

exports.styles = styles
exports.scripts = scripts
exports.watching = watching
exports.browsersync = browsersync
exports.build = series(cleanDist, building)
exports.default = parallel(styles, scripts, browsersync, watching)






