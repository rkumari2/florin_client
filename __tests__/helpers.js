const path = require('path')
const jsdom = require('jsdom');
// const carousel = require("../assets/navigation")
const { JSDOM } = jsdom;

const renderDOM = async (filename) => {
  const filePath = path.join(process.cwd(), filename);
  const dom = await JSDOM.fromFile(filePath, {
    runScripts: 'dangerously',
    resources: 'usable'
  });

  return new Promise((resolve, _) => {
    dom.window.document.addEventListener('DOMContentLoaded', () => resolve(dom));
    // dom.window.document.querySelector("#c_left",()=> carousel.left_input())
  });
};

module.exports = { renderDOM };