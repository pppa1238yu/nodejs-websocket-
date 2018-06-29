let fs = require("fs");
function walk(dir) {
    let children = [];
    let readDirResult = fs.readdirSync(dir);
    if(readDirResult.length === 0){
        children.push(dir);
    }else {
        readDirResult.forEach(function (filename) {
            let path = dir + "/" + filename;
            let stat = fs.statSync(path);
            if (stat && stat.isDirectory()) {
                children = children.concat(walk(path))
            }
            else {
                children.push(path)
            }
        });
    }
    return children;
}
// function walk(dir,filename='data') {
//     let node = {
//         name: filename,
//         className: 'pipeline1'
//     };
//     let readDirResult = fs.readdirSync(dir);
//     if(readDirResult.length === 0){
//
//     }else {
//         node.children = [];
//         readDirResult.forEach(function (filename) {
//             let path = dir + "/" + filename;
//             let stat = fs.statSync(path);
//             if (stat && stat.isDirectory()) {
//                 node.children = node.children.concat(walk(path, filename))
//             }
//             else {
//                 node.children.push({
//                     name:filename,
//                     className: 'product-dept'
//                 })
//             }
//         });
//     }
//     return node;
// }
module.exports.playWalk = walk;
