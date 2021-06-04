#!/usr/bin/env node

const express = require('express')
const app = express()
const port = process.env.FSPRESS_PORT || 3000;
const glob = require("glob")
const path = require('path')
const nunjucks = require('nunjucks');

const allowedMethods = ['all', ...require('methods')];
const basePath = process.env.FSPRESS_BASE || '';
const allAliases = ['any', 'all', 'index'];
const debug = require('debug')('fspress');

nunjucks.configure('', {
  autoescape: true,
  express: app
});

const sendFile = (path) => (req, res) => res.sendFile(path);
const renderTemplate = (path) => (req, res) => res.render(path);

const options = {
  //   debug: '*',
  nocase: true,
  ignore: 'node_modules/**',
  cwd: path.resolve(process.cwd(), basePath)
};

const files = glob.sync("**/*.{js,json,html}", options);

files.forEach((filePath) => {
  const absolutePath = path.resolve(process.cwd(), basePath, filePath);
  const fileName = path.basename(absolutePath);
  let dirName = path.dirname(filePath);
  let [method, acceptType] = fileName.toLowerCase().split('.');

  if (allAliases.includes(method)) {
    method = 'all';
  }

  if (!allowedMethods.includes(method)) {
    debug(`[ignored] ${method} is not a valid HTTP Method (${filePath})`);
    return;
  }

  if (dirName === '.') {
    dirName = '';
  }

  let target;

  if (acceptType === 'js') {
    target = require(absolutePath);
  }

  if (acceptType === 'html') {
    target = renderTemplate(absolutePath);
  }

  if (['json', 'xml'].includes(acceptType)) {
    target = sendFile(absolutePath);
  }

  app[method](`/${dirName}`, target);
  console.log(`${method.toUpperCase()} ${dirName} => ${fileName} (${absolutePath})`);

  //   const fileName = 
});

app.listen(port, () => {
  console.log(`fspress listening at http://localhost:${port}`)
})

module.exports = app;
