const mysql = require('mysql');
const config = require('./config');
// const db = mysql.createConnection({
//     host:'localhost',
//     user:'faraz',
//     password:'root',
//     database:'agency-app'
// });

const db = mysql.createConnection({
    host: config.HOST, //'localhost',
    user: config.USER,//'faraz',
    password: config.PASSWORD, //'root',
    database: config.DB //'agency-app'
});

db.connect((err)=>{
    if(err){
        throw err;
    }else{
        console.log('connected to database');
    }
});

module.exports = db;

