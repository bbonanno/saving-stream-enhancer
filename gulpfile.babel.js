'use strict';

const gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    rename = require('gulp-rename'),
    browserify = require('browserify'),
    glob = require('glob'),
    es = require('event-stream'),
    del = require('del'),
    wrapper = require('gulp-wrapper'),
    bufferify = require('vinyl-buffer'),
    pkg = require('./package.json'),
    babel = require('gulp-babel');

const distFolder = './dist';

const header = file => {
    const fileName = file.path.replace(__dirname, '').replace('/src/lendy/', '').replace('.js', '');

    return [
        '// ==UserScript==',
        `// @name           ${pkg.name} => ${fileName}`,
        `// @version        ${pkg.version}`,
        `// @timestamp      ${new Date().toISOString()}`,
        `// @author         ${pkg.author}`,
        `// @match          https://lendy.co.uk/${fileName}`,
        '// @homepageURL    https://github.com/bbonanno/saving-stream-enhancer',
        `// @downloadURL    https://github.com/bbonanno/saving-stream-enhancer/raw/master/dist/lendy/${fileName}.user.js`,
        '// @require        http://code.jquery.com/jquery-latest.min.js',
        '// @require        https://raw.githubusercontent.com/christianbach/tablesorter/master/jquery.tablesorter.min.js',
        '// ==/UserScript==',
        '\n'
    ].join('\n');
};

gulp.task('clean', function (cb) {
    return del([distFolder], cb);
});

gulp.task('dist', ['clean'], function (done) {
    glob('./src/lendy/**/*.js', function (err, files) {
        if (err) done(err);

        const tasks = files.map(function (entry) {
            return browserify({entries: [entry]})
                .bundle()
                .pipe(source(entry))
                .pipe(bufferify())
                .pipe(babel({
                    presets: ['es2015']
                }))
                .pipe(wrapper({
                    header: header
                }))
                .pipe(rename(file => {
                    file.dirname = file.dirname.replace('src/', '');
                    file.extname = '.user.js';
                }))
                .pipe(gulp.dest(distFolder));
        });
        es.merge(tasks).on('end', done);
    })
});

gulp.task('default', ['dist']);
