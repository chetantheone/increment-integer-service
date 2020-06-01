const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const app = express();
const Config = require("./config");
const port = Config.port;
const controller = require("./controllers/Controller");
const utilityHelper = require("./helpers/UtilityHelper");
const {
    db: dbURL 
} = Config;

// set view engine
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
// parse cookie
app.use(cookieParser());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.get('/', utilityHelper.authriseToken, controller.home );
app.get('/current', utilityHelper.authriseToken, controller.currentCounter );
app.post('/next', utilityHelper.authriseToken, controller.nextCounter );
app.post('/set', utilityHelper.authriseToken, controller.setCounter );
app.post('/logout', controller.logout );

// connect to db
mongoose.connect(dbURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

mongoose.connection.on('connected', function(){
    console.log("Mongoose default connection is open");
    app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
});

mongoose.connection.on('error', function(err){
    console.log(new Error("Mongoose default connection has occured "+err+" error"));
});