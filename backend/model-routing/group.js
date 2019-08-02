const express = require('express');
const groups = express.Router()
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const { check, validationResult } = require('express-validator');
groups.use(cors());
const con = require('../connection/connection')
const SECRET_KEY = process.env.SECRET;

//Add Group;

groups.post("/add", [
    check('g_name').not().isEmpty().withMessage('Cannot be Blank')
], (req, res) => {
    try {
        if (res) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).jsonp({ msg: errors.array() });
            }
            else {
                const decoded = jwt.verify(req.headers['authorization'], SECRET_KEY)
                if (decoded) {
                    const check = `select u_name from user where u_email='${decoded.email}'`
                    con.query(check, (err, data) => {
                        if (data.length != 0) {
                            var today = new Date();

                            var dd = String(today.getDate()).padStart(2, '0');
                            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                            var yyyy = today.getFullYear();
                            today = yyyy + '-' + mm + '-' + dd;
                            console.log(today);
                            var sql = `insert into groups (g_name,created_by,created_date) values('${req.body.g_name}','${data[0]['u_name']}','${today}')`
                            con.query(sql, (err, result) => {
                                if (result) {
                                    res.status(200).send({ msg: 'Group Created..!' })
                                }
                                else {
                                    res.status(422).send({ msg: err['sqlMessage'] })
                                }
                            });
                        }
                    })
                }
            }
        }
    }
    catch (error) {
        res.status(401).send({ msg: `You are Not Authorized` })
    }
});

//Own Creted Groups
groups.get("/allgroup", (req, res) => {
    try {
        const decoded = jwt.verify(req.headers['authorization'], SECRET_KEY)
        if (decoded) {
            const check = `select u_name from user where u_email='${decoded.email}'`
            con.query(check, (err, data) => {
                if (data.length != 0) {
                    var sql = `select * FROM groups WHERE created_by ='${data[0]['u_name']}'`;
                    con.query(sql, (err, result) => {
                        if (result) {
                            res.status(200).send({ result })
                        }
                        else {
                            res.status(422).send({ msg: err['sqlMessage'] })
                        }
                    });
                }
            })
        }
    } catch (error) {
        res.status(401).send({ msg: `You are Not Authorized` })
    }

})

//all Groups
groups.get("/group/allgroups", (req, res) => {
    try {
        const decoded = jwt.verify(req.headers['authorization'], SECRET_KEY)
        if (decoded) {
            var sql = `select * FROM groups `;
            con.query(sql, (err, result) => {
                if (result) {
                    res.status(200).send({ result })
                }
                else {
                    res.status(422).send({ msg: err['sqlMessage'] })
                }
            });
        }
    } catch (error) {
        res.status(401).send({ msg: `You are Not Authorized` })
    }

})

//Delete Groups
groups.delete("/delete/:id", (req, res) => {
    try {
        const decoded = jwt.verify(req.headers['authorization'], SECRET_KEY)
        if (decoded) {
            const check = `select u_name from user where u_email='${decoded.email}'`
            con.query(check, (err, data) => {
                if (data.length != 0) {                   
                    var sql = `DELETE  FROM groups WHERE g_id=${req.params.id} and created_by='${data[0]['u_name']}'`;
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
    }
    catch (error) {
        res.status(401).send({ msg: `You can not be Delete..!` })
    }
});



module.exports = groups;