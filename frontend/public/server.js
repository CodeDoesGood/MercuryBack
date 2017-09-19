const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.resolve(`${__dirname}/`)));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('*', (req, res) => { res.sendFile(path.resolve(`${__dirname}/index.html`)); });

app.listen(port, () => { console.log(`Server listening on port: ${port}`); });
