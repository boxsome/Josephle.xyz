/*eslint-env node*/
/*eslint no-console: 0 */
"use strict";

import fs from "fs";
import gulp from "gulp";
import gulpRunSequence from "run-sequence";
import livereload from "gulp-livereload";
import q from "q";
import handlebars from "gulp-compile-handlebars";

const plugins = require("gulp-load-plugins")();
// path config
const PATH_ROOT = `${__dirname}/`;
const PATH_FONTS = `${PATH_ROOT}fonts/`;
const PATH_FILES = `${PATH_ROOT}files/`;
const PATH_BUILD = `${PATH_ROOT}www/`;
const PATH_BUILD_CSS = `${PATH_BUILD}css/`;
const PATH_BUILD_HTML = `${PATH_BUILD}html/`;
const PATH_BUILD_IMG = `${PATH_BUILD}images/`;
const PATH_BUILD_JS = `${PATH_BUILD}js/`;
const PATH_BUILD_FONTS = `${PATH_BUILD}fonts/`;
const PATH_BUILD_FILES = `${PATH_BUILD}files/`;
const PATH_SRC = `${PATH_ROOT}src/`;
const PATH_SRC_VENDOR = `${PATH_SRC}vendor/`;
const PATH_SRC_HTML = `${PATH_SRC}html/`;
const PATH_SRC_IMG = `${PATH_ROOT}images/`;
const PATH_SRC_JS = `${PATH_SRC}js/`;
const PATH_SRC_JS_VENDOR = `${PATH_SRC_VENDOR}js/`;
const PATH_SRC_MODULES = `${PATH_SRC}modules/`;
const PATH_SRC_HANDLEBARS = `${PATH_SRC}handlebars/`;
const PATH_SRC_SASS = `${PATH_SRC}scss/`;
const PATH_SRC_PROJECTS = `${PATH_ROOT}projects/`;

const isRelease = () => process.env.NODE_ENV === "production";

const livereloadChanged = (file) => { livereload.changed(file.path); };

const escapeRegExp = (string) => string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");

const replaceAll = (string, find, replace) => string.replace(new RegExp(escapeRegExp(find), "g"), replace);

//equality helper for handlebars
const eq = (lval, rval, options) => (lval === rval) ? options.fn() : options.inverse(); 

//checks if number can perfectly divide into other number
const isMod0 = (val, divider, options) => (val % divider === 0) ? options.fn() : options.inverse();

//plus one handlebars helper
const plus1 = (val) => parseInt(val) + 1;

//handlebars helper replace space with dash
const replaceSpaces = (val) => replaceAll(val, " ", "-");

//handlebars helper to replace dashes with space
const replaceDashes = (val) => replaceAll(val, "-", " ");

//misc
const handlebarOptions = {
  ignorePartials: true,
  batch: ["./src/handlebars/partials/"],
  helpers: {
    eq: eq,
    isMod0: isMod0,
    plus1: plus1,
    replaceSpaces: replaceSpaces,
    replaceDashes: replaceDashes
  }
};

// create error-handling gulp.src replacement
gulp.plumbedSrc = (...args) => {
  return gulp.src.apply(gulp, args)
    .pipe(plugins.plumber({
      errorHandler: (error) => {
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

gulp.task("about", () => {

  return gulp.plumbedSrc([
    `${PATH_SRC_HANDLEBARS}about.handlebars`
  ])

    .pipe(handlebars({ "about-active": true }, handlebarOptions))

    .pipe(plugins.rename((path) => {
      path.extname = ".html";
    }))

    .pipe(plugins.minifyHtml())

    .pipe(gulp.dest(PATH_BUILD_HTML));
});

gulp.task("build", () => {
  const deferred = q.defer();
  console.log(isRelease() + " production");
  gulpRunSequence("clean", ["js", "sass", "static", "fonts", "files", "html", "about", "img"], "watch", () => {
    deferred.resolve();
  });
  return deferred.promise;
});

gulp.task("clean", () => {
  return gulp.plumbedSrc(PATH_BUILD, { read: false })
    .pipe(plugins.rimraf());
});

// default task
gulp.task("default", ["build"]);

gulp.task("files", () => {
  return gulp.plumbedSrc([
    `${PATH_FILES}**/*`
  ])
    .pipe(gulp.dest(PATH_BUILD_FILES));
});

gulp.task("fonts", () => {
  return gulp.plumbedSrc([
    `${PATH_FONTS}**/*`
  ])
  .pipe(gulp.dest(PATH_BUILD_FONTS));
});

gulp.task("html", ["about", "projects:pages", "projects:home"]); //convenience task to build all html

gulp.task("img", ["img:common", "projects:images"]); //convenience task to build all images

gulp.task("img:common", () => {
  return gulp.plumbedSrc([
    `${PATH_SRC_IMG}**/*`
  ])
    .pipe(plugins.if(isRelease(), plugins.imagemin({
      optimizationLevel: 2,
      progressive: true,
      interlaced: true,
      multipass: true
    })))
    .pipe(gulp.dest(PATH_BUILD_IMG));
});

gulp.task("img:modules", () => {
  return gulp.plumbedSrc([
    `${PATH_SRC_MODULES}**/*.jpg`,
    `${PATH_SRC_MODULES}**/*.png`,
    `${PATH_SRC_MODULES}**/*.svg`
  ])
    .pipe(plugins.if(isRelease(), plugins.imagemin({
      optimizationLevel: 2,
      progressive: true,
      interlaced: true,
      multipass: true
    })))
    .pipe(gulp.dest(PATH_BUILD_IMG));
});

gulp.task("js", ["js:main", "js:vendor"]);

gulp.task("js:main", () => {
  return gulp.plumbedSrc([
    `${PATH_SRC_JS}**/*.js`
  ])
    .pipe(plugins.babel())
    .pipe(plugins.if(!isRelease(), plugins.sourcemaps.init()))
    .pipe(plugins.concat("main.js"))
    .pipe(plugins.if(!isRelease(), plugins.sourcemaps.write("./")))
    .pipe(plugins.if(isRelease(), plugins.uglify()))
    .pipe(gulp.dest(PATH_BUILD_JS));
});

gulp.task("js:vendor", () => {
  return gulp.plumbedSrc([
    PATH_SRC_JS_VENDOR + "jquery/dist/jquery.js",
  ])
    .pipe(plugins.concat("vendor.js"))
    .pipe(plugins.if(isRelease(), plugins.uglify()))
    .pipe(gulp.dest(PATH_BUILD_JS));
});

gulp.task("projects", ["projects:images", "projects:home", "projects:pages"]); //convenience task to build all project related things

gulp.task("projects:images", () => {
  return gulp.plumbedSrc([
    `${PATH_SRC_PROJECTS}*/images/**/*`
  ])
    .pipe(plugins.rename((path) => {
      path.dirname = replaceAll(path.dirname.replace("images", ""), " ", "-");
      return path;
    }))
    .pipe(plugins.if(isRelease(), plugins.imagemin({
      optimizationLevel: 2,
      progressive: true,
      interlaced: true,
      multipass: true
    })))
    .pipe(gulp.dest(PATH_BUILD_IMG));
});

gulp.task("projects:home", () => {
  const templateData = {};
  let projectNames;

  if (fs.existsSync(`${PATH_SRC_PROJECTS}order.json`)) {
    projectNames = require(`${PATH_SRC_PROJECTS}order.json`);
    projectNames = projectNames["order"];
  }
  else {
    projectNames = fs.readdirSync(PATH_SRC_PROJECTS);
  }

  templateData["landing-active"] = true;
  templateData["project"] = [];
  projectNames.forEach((element) => {
    const projectData = {};
    let iconsJson;
    let str;

    projectData["name"] = element;
    projectData["link"] = replaceAll(element, " ", "-");
    projectData["img"] = `images/${replaceAll(element, " ", "-")}/thumbnail.png`;
    projectData["blurb"] = fs.readFileSync(`${PATH_SRC_PROJECTS}${element}/blurb.txt`, "utf8");
    if (fs.existsSync(`${PATH_SRC_PROJECTS}${element}/icons.json`)) {
      iconsJson = require(`${PATH_SRC_PROJECTS}${element}/icons.json`),
      str = iconsJson["icons"].join(",");
      projectData["icons"] = str.toLowerCase().replace(" ", "-").split(",");
    }
    templateData["project"].push(projectData);
  });

  console.log(templateData);
  console.log(projectNames);
  return gulp.plumbedSrc([
    `${PATH_SRC_HANDLEBARS}index.handlebars`
  ])

    .pipe(handlebars(templateData, handlebarOptions))

    .pipe(plugins.rename((path) => {
      path.extname = ".html";
    }))

    .pipe(plugins.minifyHtml())

    .pipe(gulp.dest(PATH_BUILD_HTML));
});

gulp.task("projects:pages", () => {
  return gulp.plumbedSrc([
    PATH_SRC_PROJECTS + "*/description.txt"
  ])
    .pipe(plugins.foreach((stream, file) => {
      const json = {};
      const absPath = file.path;
      const absPathSplit = absPath.split("\\");
      const parentDirectoryName = absPathSplit[absPathSplit.length - 2];
      const imageNames = fs.readdirSync(absPathSplit.slice(0, absPathSplit.length - 1)
        .join("\\") + "\\images")
        //we want to capture files like Image1-left, Image1-right, etc. allows us to append classes to the images })
        .filter((name) => name.match(/^Image[1-9][0-9]*-.*/)) 
        //we want to sort purely by the number in the string
        //we only want images in the format Image1, Image2, etc. supporting up to Image99
        .sort((a, b) => a.match(/[1-9][0-9]*/)[0] - b.match(/[1-9][0-9]*/)[0]);

      let iconsJson, str;

      json["project-active"] = true;
      json["description"] = file.contents.toString(); //split into paragraphs
      json["name"] = parentDirectoryName;
      json["img"] = [];
      json["img-class"] = [];
      json["blurb"] = fs.readFileSync(`${PATH_SRC_PROJECTS}${parentDirectoryName}/blurb.txt`, "utf8");

      imageNames.forEach((val) => {
        const filePath = "images/" + replaceAll(parentDirectoryName, " ", "-") + "/" + val;
        const obj = {};
        console.log(filePath);
        obj["link"] = filePath;
        obj["class"] = val.substring(val.indexOf("-") + 1, val.indexOf(".")); //get the portion after "-" which indicates the class
        json["img"].push(obj);
      });

      if (fs.existsSync(`${PATH_SRC_PROJECTS}${parentDirectoryName}/icons.json`)) {
        iconsJson = require(`${PATH_SRC_PROJECTS}${parentDirectoryName}/icons.json`);
        str = iconsJson["icons"].join(",");
        json["icons"] = replaceAll(str.toLowerCase(), " ", "-").split(",");
      }
      console.log(json);
      return gulp.plumbedSrc([
        PATH_SRC_HANDLEBARS + "index.handlebars"
      ])
        .pipe(handlebars(json, handlebarOptions))

        .pipe(plugins.rename((path) => {
          path.extname = ".html";
          path.basename = replaceAll(parentDirectoryName, " ", "-");
        }))
        .pipe(gulp.dest(PATH_BUILD_HTML));
    }))

    .pipe(plugins.rename((path) => {
      path.extname = ".html";
    }))

    .pipe(plugins.minifyHtml())

    .pipe(gulp.dest(PATH_BUILD_HTML));

});

gulp.task("sass", () => {
  return gulp.plumbedSrc([
    `${PATH_SRC_SASS}**/*.scss`,
    `${PATH_SRC_VENDOR}normalize-css/normalize.css`
  ])
    .pipe(plugins.if(!isRelease(), plugins.sourcemaps.init()))
    .pipe(plugins.if("**/*.scss", plugins.sass({
      outputStyle: "nested"
    })))
    .pipe(plugins.concat("main.css"))
    .pipe(plugins.if(isRelease(), plugins.cleanCss({ rebase: false })))
    .pipe(plugins.if(!isRelease(), plugins.sourcemaps.write("./")))
    .pipe(gulp.dest(PATH_BUILD_CSS));
});

gulp.task("static", () => {
  return gulp.plumbedSrc([
    `${PATH_ROOT}favicon.ico`,
    `${PATH_SRC}index.html`,
    `${PATH_SRC}server.js`,
    `${PATH_ROOT}sitemap.xml`
  ])
    .pipe(gulp.dest(PATH_BUILD));
});

gulp.task("watch", (watch) => {
  if (watch) {
    const config = { 
      debounceDelay: 2000, 
      interval: 1000 
    };

    livereload.listen({
      quiet: true
    });

    gulp.watch(`${PATH_SRC_HTML}**/*`, config, ["html"]).on("change", livereloadChanged);
    gulp.watch(`${PATH_SRC_IMG}**/*`, config, ["img"]).on("change", livereloadChanged);
    gulp.watch([
      `${PATH_SRC_MODULES}jpg`,
      `${PATH_SRC_MODULES}png`,
      `${PATH_SRC_MODULES}svg`
    ], config, ["img:modules"]).on("change", livereloadChanged);
    gulp.watch(`${PATH_SRC_JS_VENDOR}js`, config, ["js:vendor"]).on("change", livereloadChanged);

    gulp.watch(`${PATH_SRC}scss`, config, ["sass"]).on("change", livereloadChanged);
    gulp.watch([
      `${PATH_ROOT}favicon.ico`
    ], config, ["static"]).on("change", livereloadChanged);
  }
});
