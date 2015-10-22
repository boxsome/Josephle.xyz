"use strict";

// requires
var _               = require('lodash-node'),
    fs              = require("fs"),
    gulp            = require("gulp-param")(require("gulp"), process.argv),
    gulpLoadPlugins = require("gulp-load-plugins"),
    gulpRunSequence = require("run-sequence"),
    livereload      = require("gulp-livereload"),
    path            = require("path"),
    plugins         = gulpLoadPlugins(),
    q               = require("q"),
    handlebars      = require("gulp-compile-handlebars"),
    rename          = require("gulp-rename"),
    data            = require("gulp-data"),
    foreach         = require("gulp-foreach"),
    
    // path config
    PATH_ROOT = __dirname + "/",
    PATH_FONTS = PATH_ROOT + "fonts/",
    PATH_FILES = PATH_ROOT + "files/",
    PATH_BUILD = PATH_ROOT + "www/",
    PATH_BUILD_CSS = PATH_BUILD + "css/",
    PATH_BUILD_HTML = PATH_BUILD + "html/",
    PATH_BUILD_IMG = PATH_BUILD + "images/",
    PATH_BUILD_JS = PATH_BUILD + "js/",
    PATH_BUILD_FONTS = PATH_BUILD + "fonts/",
    PATH_BUILD_FILES = PATH_BUILD + "files/",
    PATH_SRC = PATH_ROOT + "src/",
    PATH_SRC_VENDOR = PATH_SRC + "vendor/",
    PATH_SRC_HTML = PATH_SRC + "html/",
    PATH_SRC_IMG = PATH_ROOT + "images/",
    PATH_SRC_JS = PATH_SRC + "js/",
    PATH_SRC_JS_VENDOR = PATH_SRC_VENDOR + "js/",
    PATH_SRC_MODULES = PATH_SRC + "modules/",
    PATH_SRC_HANDLEBARS = PATH_SRC + "handlebars/",
    PATH_SRC_HANDLEBARS_PARTIALS = PATH_SRC_HANDLEBARS + "partials",
    PATH_SRC_JSON = PATH_SRC + "json/",
    PATH_SRC_SASS = PATH_SRC + "scss/",
    PATH_SRC_PROJECTS = PATH_ROOT + "projects/",

    //misc
    handlebarOptions = {
      ignorePartials: true,
      batch: ["./src/handlebars/partials/"],
      helpers: {
        eq: eq,
        isMod0: isMod0,
        plus1: plus1,
        replaceSpaces: replaceSpaces
      }
    };

function isDev(env) {
  return ((env === null) || (env === "dev"));
}

function isRelease(release) {
  return (release === true);
}

function livereloadChanged(file) {
  livereload.changed(file.path);
}

function escapeRegExp(string) {
  return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(string, find, replace) {
  return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

//equality helper for handlebars
function eq (lval, rval, options) {
  if (lval === rval) return options.fn();
  else return options.inverse();
}

//checks if number can perfectly divide into other number
function isMod0 (val, divider, options) {
  if (val % divider === 0) return options.fn();
  else return options.inverse();
}

//plus one handlebars helper
function plus1 (val) {
  return parseInt(val) + 1;
}

//handlebars helper replace space with dash
function replaceSpaces(val) {
  return replaceAll(val, " ", "-");
}

// create error-handling gulp.src replacement
gulp.plumbedSrc = function () {
  return gulp.src.apply(gulp, Array.prototype.slice.call(arguments))
    .pipe(plugins.plumber({
      errorHandler: function (error) {
        console.error.bind(error);
        plugins.notify.onError({
            title: "Gulp Error",
            message: "Error: <%= error %>",
            sound: "Bottle"
        })(error);
        this.emit("end");
      }
    }));
};

gulp.task("about", function() {

  return gulp.plumbedSrc([
      PATH_SRC_HANDLEBARS + "about.handlebars"
    ])

    .pipe(handlebars({ "about-active": true }, handlebarOptions))

    .pipe(rename(function(path){
      path.extname = ".html";
    }))

    .pipe(plugins.minifyHtml())

    .pipe(gulp.dest(PATH_BUILD_HTML));
});

gulp.task("build", function () {
  var deferred = q.defer();
  gulpRunSequence("clean", ["img", "js", "sass", "static", "fonts", "files", "projects", "about", "css"], "watch", function () {
    deferred.resolve();
  });
  return deferred.promise;
});

gulp.task("clean", function () {
  return gulp.plumbedSrc(PATH_BUILD, { read: false })
    .pipe(plugins.rimraf());
});

gulp.task("css", function() {
  return gulp.plumbedSrc([
      PATH_SRC_VENDOR + "normalize-css/normalize.css"
  ])
  .pipe(gulp.dest(PATH_BUILD_CSS));
});

// default task
gulp.task("default", ["build"]);

gulp.task("files", function() {
  return gulp.plumbedSrc([
        PATH_FILES + "**/*"
  ])
      .pipe(gulp.dest(PATH_BUILD_FILES));
});

gulp.task("fonts", function() {
  return gulp.plumbedSrc([
    PATH_FONTS + "**/*"
  ])
  .pipe(gulp.dest(PATH_BUILD_FONTS));
});

gulp.task("html", function () {
  return gulp.plumbedSrc([
      PATH_SRC_HTML + "**/*.html"
    ])
    .pipe(gulp.dest(PATH_BUILD_HTML));
});

gulp.task("img", ["img:common"]);

gulp.task("img:common", function (release) {
  return gulp.plumbedSrc([
      PATH_SRC_IMG + "**/*"
    ])
    .pipe(plugins.if(isRelease(release), plugins.imagemin({
      optimizationLevel: 2,
      progressive: true,
      interlaced: true,
      multipass: true
    })))
    .pipe(gulp.dest(PATH_BUILD_IMG));
});

gulp.task("img:modules", function (release) {
  return gulp.plumbedSrc([
      PATH_SRC_MODULES + "**/*.jpg",
      PATH_SRC_MODULES + "**/*.png",
      PATH_SRC_MODULES + "**/*.svg"
    ])
    .pipe(plugins.if(isRelease(release), plugins.imagemin({
      optimizationLevel: 2,
      progressive: true,
      interlaced: true,
      multipass: true
    })))
    .pipe(gulp.dest(PATH_BUILD_IMG));
});

gulp.task("js", ["js:main", "js:vendor"]);

gulp.task("js:main", function (release) {
  return gulp.plumbedSrc([
      PATH_SRC_JS + "**/*.js"
    ])
    .pipe(plugins.if(!isRelease(release), plugins.sourcemaps.init()))
    .pipe(plugins.concat("main.js"))
    .pipe(plugins.if(!isRelease(release), plugins.sourcemaps.write("./")))
    .pipe(gulp.dest(PATH_BUILD_JS));
});

gulp.task("js:vendor", function () {
  return gulp.plumbedSrc([
      PATH_SRC_JS_VENDOR + "jquery/dist/jquery.js",
    ])
    .pipe(plugins.concat("vendor.js"))
    .pipe(gulp.dest(PATH_BUILD_JS));
});

gulp.task("projects", ["projects:images", "projects:home", "projects:pages"]);

gulp.task("projects:images", function() {
  return gulp.plumbedSrc([
    PATH_SRC_PROJECTS + "*/images/**/*"
    ])
    .pipe(rename(function (path) {
        path.dirname = replaceAll(path.dirname.replace("images", ""), " ", "-");
        return path;
    }))
    .pipe(gulp.dest(PATH_BUILD_IMG));
});

gulp.task("projects:home", function() {
  var templateData = {},
      projectNames = fs.readdirSync(PATH_SRC_PROJECTS);

  templateData["landing-active"] = true;
  templateData["project"] = [];
  projectNames.forEach(function(element) {
    var projectData = {},
      iconsJson,
      str;

    projectData["name"] = element;
    projectData["link"] = replaceAll(element, " ", "-");
    projectData["img"] = "images/" + replaceAll(element, " ", "-") + "/thumbnail.png";
    projectData["blurb"] = fs.readFileSync(PATH_SRC_PROJECTS + element + "/blurb.txt", "utf8");
    if (fs.existsSync(PATH_SRC_PROJECTS + element + "/icons.json")) {
      iconsJson = require(PATH_SRC_PROJECTS + element + "/icons.json"),
      str = iconsJson["icons"].join(",");
      projectData["icons"] = str.toLowerCase().replace(" ", "-").split(",");
    }
    templateData["project"].push(projectData);
  });

  console.log(templateData);
  return gulp.plumbedSrc([
      PATH_SRC_HANDLEBARS + "index.handlebars"
    ])

    .pipe(handlebars(templateData, handlebarOptions))

    .pipe(rename(function(path){
      path.extname = ".html";
    }))

    .pipe(plugins.minifyHtml())

    .pipe(gulp.dest(PATH_BUILD_HTML));
});

gulp.task("projects:pages", function() {
  return gulp.plumbedSrc([
        PATH_SRC_PROJECTS + "*/description.txt"
    ])
    .pipe(foreach(function(stream, file) {
      var json = {},
        iconsJson, str,
        absPath = file.path,
        absPathSplit = absPath.split("\\"),
        parentDirectoryName = absPathSplit[absPathSplit.length - 2],
        imageNames = fs.readdirSync(absPathSplit.slice(0, absPathSplit.length - 1).join("\\") + "\\images").filter(function (name) {
          return name.match(/^Image\d/);
        }).sort(); //we only want images in the format Image1, Image2, etc.

        json["project-active"] = true;
        json["description"] = file.contents.toString(); //split into paragraphs
        json["name"] = parentDirectoryName;
        json["img"] = [];
        json["blurb"] = fs.readFileSync(PATH_SRC_PROJECTS + parentDirectoryName + "/blurb.txt", "utf8");

        imageNames.forEach(function(val) {
          var filePath = "images/" + replaceAll(parentDirectoryName, " ", "-") + "/" + val;
          console.log(filePath);
          json["img"].push(filePath);
        });

        if (fs.existsSync(PATH_SRC_PROJECTS + parentDirectoryName + "/icons.json")) {
          iconsJson = require(PATH_SRC_PROJECTS + parentDirectoryName + "/icons.json"),
              str = iconsJson["icons"].join(",");
          json["icons"] = replaceAll(str.toLowerCase(), " ", "-").split(",");
        }
        console.log(json);
      return gulp.plumbedSrc([
        PATH_SRC_HANDLEBARS + "index.handlebars"
        ])

        .pipe(handlebars(json, handlebarOptions))

        .pipe(rename(function(path){
          path.extname = ".html";
          path.basename = replaceAll(parentDirectoryName, " ", "-");
        }))

        .pipe(gulp.dest(PATH_BUILD_HTML));
    }))

    .pipe(rename(function(path){
      path.extname = ".html";
    }))

    .pipe(plugins.minifyHtml())

    .pipe(gulp.dest(PATH_BUILD_HTML));

});

gulp.task("sass", function (release) {
  return gulp.plumbedSrc([
      PATH_SRC_SASS + "**/*.scss"
    ])
    .pipe(plugins.if(!isRelease(release), plugins.sourcemaps.init()))
    .pipe(plugins.sass({ 
      outputStyle: "nested"
    }))
    .pipe(plugins.if(isRelease(release), plugins.minifyCss({ rebase: false })))
    .pipe(plugins.if(!isRelease(release), plugins.sourcemaps.write("./")))
    .pipe(gulp.dest(PATH_BUILD_CSS));
});

gulp.task("static", function () {
  return gulp.plumbedSrc([
      PATH_ROOT + "favicon.ico",
      PATH_SRC + "index.html",
      PATH_SRC + "server.js",
      PATH_ROOT + "sitemap.xml"
    ])
    .pipe(gulp.dest(PATH_BUILD));
});

gulp.task("watch", function (watch) {
  if (watch) {
    var config = { 
      debounceDelay: 2000, 
      interval: 1000 
    };

    livereload.listen({
      quiet: true
    });

    gulp.watch(PATH_SRC_HTML + "**/*", config, ["html"]).on("change", livereloadChanged);
    gulp.watch(PATH_SRC_IMG + "**/*", config, ["img"]).on("change", livereloadChanged);
    gulp.watch([
      PATH_SRC_MODULES + "**/*.jpg",
      PATH_SRC_MODULES + "**/*.png",
      PATH_SRC_MODULES + "**/*.svg"
    ], config, ["img:modules"]).on("change", livereloadChanged);
    gulp.watch(PATH_SRC_JS_VENDOR + "**/*.js", config, ["js:vendor"]).on("change", livereloadChanged);

    gulp.watch(PATH_SRC + "**/*.scss", config, ["sass"]).on("change", livereloadChanged);
    gulp.watch([
      PATH_ROOT + "favicon.ico"
    ], config, ["static"]).on("change", livereloadChanged);
  }
});