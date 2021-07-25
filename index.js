const express = require('express');
const usersRoutes = require('./src/routes/users.routes');
const blesRoutes = require('./src/routes/bles_routes')
const bodyParser = require('body-parser');

const app = express();
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
})
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());

//Initiate Mongo Server
const InitiateMongoServer = require("./src/config/db_init");
InitiateMongoServer.createMongoose();

app.get("/", (req, res) => {
    res.json({ message: "API Working Cool" });
});

app.use('/', usersRoutes);
app.use('/ble', blesRoutes);

app.use(function(err, req, res, next){
    res.send({theError: err.message});
})

Port = process.env.PORT || 4000;
app.listen(Port, (err) => {
    if (err) throw err
    console.log(`Server running in http://127.0.0.1: ${Port}`)
})
