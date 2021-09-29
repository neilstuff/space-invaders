'use strict';

const config = require('./config.json');

const {app, protocol, BrowserWindow} = require('electron');

const path = require('path')
const url = require('url')

var mainWindow = null;


function createWindow() {

    mainWindow = new BrowserWindow({ width: 740, height: 820, resizable: false, autoHideMenuBar: true });

    if (config.mode == "debug") {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.setMenu(null);
    mainWindow.loadURL(`file:///${path.join(__dirname, 'index.html')}`);

    mainWindow.on('closed', () => {
        mainWindow = null
    })

}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    app.quit()
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})