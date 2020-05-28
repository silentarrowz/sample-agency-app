const mysql = require('mysql');

const db = mysql.createConnection({
    host:'localhost',
    user:'faraz',
    password:'root',
    database:'agency-app'
});

db.connect((err)=>{
    if(err){
        throw err;
    }else{
        console.log('connected to database');
    }
});

module.exports = db;

