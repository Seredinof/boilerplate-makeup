let fs = require("fs"),
    path = require('path'),
    html2bemjson = require('html2bemjson'),
    bemjsonToDecl = require('bemjson-to-decl'),
    bemDecl = require('bem-decl'),
    bemconfig = require('./bem.config');

let bundlesPath = path.join(__dirname, bemconfig.bundlesName);
let levels = bemconfig.levels;
let blocks = [];
blocks = blocks.concat(bemconfig.mustDeps);

let promiseReadBundles = new Promise(function (resolve, reject) {

    let bundlesArr = [];

    fs.readdir(bundlesPath, function(err, items) {

        if(err) throw err;

        for (let i=0; i<items.length; i++) {
            if(path.extname(items[i]) == '.html') {
                bundlesArr.push(bundlesPath+'/'+items[i]);
            }
        }

        resolve(bundlesArr);
    });
})

function makeDecl(file) {
    return new Promise(function (resolve, reject) {
        fs.readFile(file, 'utf8', function(err, data) {

            if (err) throw err;

            data = data.slice(data.indexOf('<body'), data.indexOf('</body>') + 7);

            /*fs.writeFile(`${path.dirname(file)}/${path.basename(file, '.html')}.bemjson.js`, html2bemjson.stringify(data) , 'utf-8', function (err){
                if (err) throw err;
                fs.writeFile(`${path.dirname(file)}/${path.basename(file, '.html')}.bemdecl.js`, bemjsonToDecl.stringify(html2bemjson.convert(data), null, {indent: '\t'}) , 'utf-8', function (err){
                    if (err) throw err;
                    resolve(bemjsonToDecl.convert(html2bemjson.convert(data)));
                });
            });*/

            resolve(bemjsonToDecl.convert(html2bemjson.convert(data)));
        });
    })
}

function traverse(obj) {
    for(let key in obj) {
        if(key == 'block' && blocks.indexOf(obj[key]) == -1) blocks.push(obj[key]);
        if(typeof obj[key] == 'object') {
            traverse(obj[key]);
        }
    }
}

function getFilesFromBlocks(blocks, levels) {

    let blockDirs = [];

    levels.map(function(level) {

        blocks.map(function(blockName) {
            let dirName = path.join(__dirname, '/'+level+'/'+blockName+'/');
            blockDirs.push(dirName);
        })
    });
    return blockDirs;
}

module.exports = promiseReadBundles.then(function(bundlesArr){
    return Promise.all(bundlesArr.map(makeDecl));
}).then(function (declarations) {
    traverse(bemDecl.merge(...declarations));
    return getFilesFromBlocks(blocks, levels);
})
