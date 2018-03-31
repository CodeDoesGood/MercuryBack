/**
 * Builds the documentation in a html format that can then be used for interacting with the mercury
 * api interface. To build the most up to date documentation, call "npm run build:api", the output
 * will be placed in a folder called "pages" with a html file for each endpoint
 * 
 * @name buildAPI
 * @version 0.0.1
 * @author Stephen Lineker-Miller<tehstun>
 */
const fs = require('fs');
const path = require('path');
const raml2html = require('raml2html');

const configWithDefaultTheme = raml2html.getConfigForTheme();

const files = fs.readdirSync(__dirname);

if (!fs.existsSync(path.join(__dirname, 'pages'))) {
  fs.mkdirSync(path.join(__dirname, 'pages'));
}

files.forEach((file) => {
  if (!file.endsWith('.js') && !file.endsWith('.cmd') && file != 'pages') {
    raml2html.render(path.join(__dirname, file, `${file}.raml`), configWithDefaultTheme)
    .then(result => fs.writeFileSync(path.join(__dirname, 'pages', `${file}.html`), result))
    .catch(error => console.log(error));
  }
});
