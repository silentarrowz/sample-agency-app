const routes = require('express').Router();
const token = require('./config').token;
const {verifyToken} = require('./auth');
const mysql = require('mysql');
const db = require('./db');

routes.post('/login',(req,res)=>{
    console.log('token : ',token);
    const result = {
        msg:'login successful!',
        token,
    }
    res.send(result);
});

routes.post('/create', verifyToken, (req,res)=>{
    console.log('req.body',req.body);
    const {agency_name, addr1,addr2,state,city,agency_phone, client_name,email,client_phone,total_bill} = req.body;
    const insertQuery =  "INSERT INTO agency (agency_name,addr1,addr2,state,city,agency_phone) VALUES (?,?,?,?,?,?)";
    const selectQuery = "SELECT agency_id from agency WHERE agency_name=?";
    const clientInsertQuery = "INSERT INTO client (client_name,agency_id, phone, email,total_bill) VALUES(?,?,?,?,?)";
    db.query(selectQuery,[agency_name], (err, result) => {
        if(!err){
            console.log('result of agency select : ',result);
            if(result.length>0){
                const agency_id = result[0].agency_id;
                console.log('agency id : ',agency_id);
                db.query(clientInsertQuery,[client_name,agency_id,client_phone,email,total_bill], (err,result)=>{
                    if(!err){
                        const msg = 'agency and client created successfully';
                        const resultFromClient = {
                            msg,
                            result,
                        }
                        res.status(200).send(resultFromClient);
                    }else{
                        console.log('error in inserting client  : ',err);
                        const result = {
                            msg: 'create process Failed!'
                        }
                        res.status(400).send(result);
                    }
                })
            }else{
                db.query(insertQuery,[agency_name,addr1,addr2,state,city,agency_phone], (err, result)=>{
                    if(!err){
                        console.log('result : ',result);
                        const agency_id = result.insertId;
                        const clientInsertQuery = "INSERT INTO client (client_name,agency_id, phone, email,total_bill) VALUES(?,?,?,?,?)";
                        db.query(clientInsertQuery,[client_name,agency_id,client_phone,email,total_bill], (err,result)=>{
                            if(!err){
                                const msg = 'agency and client created successfully';
                                const resultFromClient = {
                                    msg,
                                    result,
                                }
                                res.status(200).send(resultFromClient);
                            }else{
                                console.log('error in inserting client  : ',err);
                                const result = {
                                    msg: 'create process Failed!'
                                }
                                res.status(400).send(result);
                            }
                        })
                        
                    }else{
                        console.log('error in inserting agency  : ',err);
                        next(err);
                    }
                });
            }
            
        }else{
            console.log('error in selecting agency : ',err);
            db.query(insertQuery,[agency_name,addr1,addr2,state,city,agency_phone], (err, result)=>{
                if(!err){
                    console.log('result : ',result);
                    const agency_id = result.insertId;
                    const clientInsertQuery = "INSERT INTO client (client_name,agency_id, phone, email,total_bill) VALUES(?,?,?,?,?)";
                    db.query(clientInsertQuery,[client_name,agency_id,client_phone,email,total_bill], (err,result)=>{
                        if(!err){
                            const msg = 'agency and client created successfully';
                            const resultFromClient = {
                                msg,
                                result,
                            }
                            res.status(200).send(resultFromClient);
                        }else{
                            console.log('error in inserting client  : ',err);
                            const result = {
                                msg: 'create process Failed!'
                            }
                            res.status(400).send(result);
                        }
                    })
                    
                }else{
                    console.log('error in inserting agency  : ',err);
                    next(err);
                }
            });
        }
    })
})

/*
SELECT c1.EID, 
       a1.AID
FROM CERTIFIED AS c1
JOIN Aircrafts AS a1 ON a1.AID = c1.AID 
JOIN        
(
  SELECT c.EID, 
         MAX(a.Crusingrange) AS Crusingrange 
  FROM CERTIFIED AS c
  JOIN Aircrafts AS a ON a.AID = c.AID 
  GROUP BY c.EID 
) AS dt ON dt.Crusingrange = a1.Crusingrange AND 
           dt.EID = c1.EID 
           */


routes.get('/get-top-client', (req, res)=>{
    const topQueryBest = "SELECT client.client_name, agency.agency_name, client.total_bill FROM agency, client WHERE agency.agency_id=client.agency_id AND client.total_bill=(SELECT MAX(total_bill) FROM client)";
    const getTopQuery = `SELECT ag.agency_name, c.client_name, FROM agency ag INNER JOIN client c on ag.agency_id = c.agency_id INNER JOIN( SELECT MAX(total_bill) total_bill FROM client GROUP BY agency_id )c1`;
    const getTopQuery2 = "SELECT ag.agency_name, c1.client_name, c.total_bill FROM agency ag JOIN (SELECT MAX(c.total_bill) from client c) as c1 GROUP BY c.agency_id";
    const getTopQuery3 = "SELECT agency_name, client_name, total_bill FROM agency ag inner join client c on ag.agency_id = c.agency_id";
    const topQuery = "SELECT a.agency_name FROM agency a INNER JOIN (SELECT agency_id, client_name, MAX(total_bill) total_bill FROM client GROUP BY agency_id ) c on a.agency_id = c.agency_id";
    const topQuery2 = "SELECT * from client INNER JOIN (SELECT client_name, MAX(total_bill) FROM client GROUP BY agency_id) total_bill ON client.agency_id = agency.agency_id";
    db.query(topQueryBest,(err,result)=>{
        if(!err){
            const rezalt = {
                msg: 'success',
                result,
            }
            res.status(200).send(rezalt);
        }else{
            res.status(400).send(err);
        }
    })
});


module.exports = routes;