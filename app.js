// 引入watcher
let walkDir = require('./walkDir');

let chokidar = require('chokidar');
let watcher = null; //监听器
let ready = false; //准备状态
const log = console.log.bind(console);

const express = require('express');
const expressWs = require('express-ws')(express());
const app = expressWs.app;
const util = require('util');
let defaultDirPath = [];
let connection = [];

const ws = require('nodejs-websocket');
let clientCount = 0;

defaultDirPath = walkDir.playWalk('./data');

let sendMsg = (type, path, conn, stat) => {
    let msg = {
        data: '.\\' + path,
        type: type,
        stat: stat
    };
    conn.sendText(JSON.stringify(msg));
};

let createWatcher = (conn) => {
    addFileListener = (path, stat) => {
        if (ready) {
            sendMsg('addFile', path, conn, stat);
        }
    };
    addDirecotryListener = (path, stat) => {
        if (ready) {
            sendMsg('addDir', path, conn, stat);
        }
    };
// 文件内容改变时
    fileChangeListener = (path, stat) => {
        sendMsg('changeFile', path, conn, stat);
    };
// 删除文件时，需要把文件里所有的用例删掉
    fileRemovedListener = (path, stat) => {
        sendMsg('removeFile', path, conn, stat);
    };
// 删除目录时
    directoryRemovedListener = (path, stat) => {
        sendMsg('removeDir', path, conn, stat);
    };
    if (!watcher) {
        watcher = chokidar.watch('./data')
    }
    watcher
        .on('add', addFileListener)
        .on('addDir', addDirecotryListener)
        .on('change', fileChangeListener)
        .on('unlink', fileRemovedListener)
        .on('unlinkDir', directoryRemovedListener)
        .on('error', function (error) {
            console.log('Error happened', error);
        })
        .on('ready', function () {
            console.info('Initial scan complete. Ready for changes.');
            ready = true
        })
        .on('close', function () {
            console.log('websorcket is closed');
        });
};

let server = ws.createServer(function (conn) {
    console.log("New connection");

    createWatcher(conn);
    conn.on('text', (msg) => {
        if (msg === 'getDefault') {
            defaultDirPath = walkDir.playWalk('./data');
            conn.sendText(JSON.stringify(defaultDirPath));
        }
    });

    conn.on("close", function(code, reason) {
        console.log("code closed", code);
        console.log("reason closed", reason);
        clientCount = 0;
    });

    conn.on("error", function(err) {
    })

}).listen(3000);



