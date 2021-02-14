const express = require('express');
const routes = require('./routes/r.routes');
const bodyParser = require('body-parser');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());

//Initiate Mongo Server
const InitiateMongoServer = require("./config/db");
InitiateMongoServer();

app.get("/", (req, res) => {
    res.json({ message: "API Working Cool" });
});

app.use('/', routes);

app.use(function(err, req, res, next){
    res.send({theError: err.message});
})

Port = process.env.PORT || 5000;
app.listen(Port, (err) => {
    if (err) throw err
    console.log(`Server running in http://127.0.0.1: ${Port}`)
})
