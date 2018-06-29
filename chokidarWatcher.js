// 初始化文件夹监听chokidar
let chokidar = require('chokidar');
let watcher = null; //监听器
let ready = false; //准备状态
const log = console.log.bind(console);

module.exports.watch = function () {
    // 文件新增时
    addFileListener = (path) => {
        if (ready) {
            log('File', path, 'has been added')
        }
    };
    addDirecotryListener = (path) => {
        if (ready) {
            log('Directory', path, 'has been added')
        }
    };
// 文件内容改变时
    fileChangeListener = (path) => {
        log('File', path, 'has been changed')
    };
// 删除文件时，需要把文件里所有的用例删掉
    fileRemovedListener = (path) => {
        log('File', path, 'has been removed')
    };
// 删除目录时
    directoryRemovedListener = (path) => {
        log('Directory', path, 'has been removed')
    };
    if (!watcher) {
        watcher = chokidar.watch('./data')
    }
// 开始监听
    watcher
        .on('add', addFileListener)
        .on('addDir', addDirecotryListener)
        .on('change', fileChangeListener)
        .on('unlink', fileRemovedListener)
        .on('unlinkDir', directoryRemovedListener)
        .on('error', function (error) {
            log.info('Error happened', error);
        })
        .on('ready', function () {
            console.info('Initial scan complete. Ready for changes.');
            ready = true
        });
};

