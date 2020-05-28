const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/',routes);

app.set('port', 8000);

app.listen(app.get('port'),()=>{
    console.log('server listening on port : ', app.get('port'));
});