var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var mongoose = require('mongoose')

const path = require('path')
require('dotenv').config({
    path: path.resolve(__dirname, './.env')
})

// Step 2 - use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Step 4 - use router middleware
const linkRouter = require('./routers/img_route.js');
app.use(linkRouter);

// const newUrl = new Url({ lien: 'https://example.com', filename: 'omelette' });

// newUrl.save()
//   .then(() => console.log('Le lien URL a été enregistré avec succès'))
//   .catch((err) => console.error(err));

mongoose.connect(process.env.IMG_URL)
    .then(() => console.log("succes"))
    .catch((err) => console.error(err))

// Step 5 - start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));