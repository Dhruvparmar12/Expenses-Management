const express = require('express');
const groups = express.Router()
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const { check, validationResult } = require('express-validator');
groups.use(cors());
const con = require('../connection/connection')
const auth = require('./auth');

//Add Group;

groups.post("/add", [
    check('g_name').not().isEmpty().withMessage('Cannot be Blank')
], auth, (req, res) => {
    try {
        if (res) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).jsonp({ msg: errors.array() });
            }
            else {
                const userData = req.user;                
                var today = new Date();
                var dd = String(today.getDate()).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = today.getFullYear();
                today = yyyy + '-' + mm + '-' + dd;
               
                var sql = `insert into groups (g_name,created_by,created_date) values('${req.body.g_name}','${userData[0]['u_id']}','${today}')`
                con.query(sql, (err, result) => {
                    if (result) {
                        res.status(200).send({ msg: 'Group Created..!' ,id:result})
                    }
                    else {
                        res.status(422).send({ msg: err['sqlMessage'] })
                    }
                });

            }
        }
    }
    catch (error) {
        res.status(401).send({ msg: error.message })
    }
});



//Own Creted Groups

groups.get("/mygroup", auth, (req, res) => {
    try {

        var sql = `SELECT * from groups join groups_member on groups.g_id=groups_member.g_id WHERE groups_member.u_id=${req.user[0]['u_id']}`;
        con.query(sql, (err, result) => {
            if (result) {
                res.status(200).send({ result });
            }
            else {
                res.status(422).send({ msg: err['sqlMessage'] });
            }
        });
    } catch (error) {   
        res.status(401).send({ msg: error.message });
    }

});


//Delete Groups
groups.delete("/delete/:id", auth, (req, res) => {
    try {
        var check = `select * from groups where g_id=${req.params.id}`
        con.query(check, (err, data) => {
            if (data.length == 0) {
                res.send({ msg: 'Group Already Deleted.!' })
            }
            else {
                var deleteauth = `select created_by from groups where g_id=${req.params.id}`
                con.query(check, (err, user) => {
                    if (user[0]['created_by'] != req.user[0]['u_id']) {
                        res.send({ msg: 'You are not Admin' });
                    }
                    else {
                        var sql = `DELETE  FROM groups WHERE  g_id=${req.params.id}`;
                        con.query(sql, (err, result) => {
                            if (result) {
                                res.status(200).send({ msg: 'Group Deleted' })
                            }
                            else {
                                res.status(422).send({ msg: err['sqlMessage'] })
                            }
                        });
                    }
                })
            }
        })
    }
    catch (error) {
        res.status(401).send({ msg: error.message })
    }
});

//Update Group
groups.patch('/update/:id', auth, (req, res) => {
    try {
        const que = `update groups set g_name='${req.body.g_name}' where g_id=${req.params.id}`
        con.query(que, (err, result) => {
            if (err) {
                res.send({ msg: err['sqlMessage'] });
            }
            else{
                res.send({msg:'Group Updated..!'});
            }
        })
    } catch (error) {
        res.status(401).send({ msg: error.message })
    }
})

module.exports = groups;