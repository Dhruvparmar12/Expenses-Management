const express = require('express');
const expenses = express.Router()
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const { check, validationResult } = require('express-validator');
expenses.use(cors());
const con = require('../connection/connection')

const auth = require('./auth');

//Add expenses
expenses.post("/add", [
    check('e_name').not().isEmpty().withMessage('Cannot be Blank'),
    check('e_amount').not().isEmpty().withMessage('Cannot be Blank'),
    check('e_date').not().isEmpty().withMessage('Cannot be Blank'),
], auth, (req, res) => {
    try {
        if (res) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).jsonp({ msg: errors.array() });
            }
            else {
                var sql = `insert into expense (u_id,e_name,e_amount,e_date) values(${req.user[0]['u_id']},'${req.body.e_name}','${req.body.e_amount}','${req.body.e_date}')`
                con.query(sql, (err, result) => {
                    if (result) {
                        res.status(200).send({ msg: 'Expenses Added' })
                    }
                    else {
                        res.status(422).send({ msg: err['sqlMessage'] });
                    }
                });
            }
        }
    }
    catch (error) {
        res.status(401).send({ msg: error.message });
    }
});

//All Expenses
expenses.get("/allexpenses", auth, (req, res) => {
    try {
        var sql = `select * FROM expense WHERE u_id=${req.user[0]['u_id']}`;
        con.query(sql, (err, result) => {
            if (result) {
                res.status(200).send(result)
            }
            else {
                res.status(422).send({ msg: err['sqlMessage'] })
            }
        });
    } catch (error) {
        res.status(401).send({ msg:error.message  })
    }

})

//get One Expenses
expenses.get("/:id", auth, (req, res) => {
    try {
        var sql = `select * FROM expense WHERE e_id=${req.params.id}`;
        con.query(sql, (err, result) => {
            if (result.length > 0) {
                res.status(200).send(result)
            }
            else {
                res.status(404).send({ msg: 'Expenses not Existed' })
            }
        });
    } catch (error) {
        res.status(401).send({msg:error.message  })
    }
});

//update expenses
expenses.patch("/update/:id", [
    check('e_name').not().isEmpty().withMessage('Cannot be Blank'),
    check('e_amount').not().isEmpty().withMessage('Cannot be Blank'),
    check('e_date').not().isEmpty().withMessage('Cannot be Blank')
], auth, (req, res) => {
    try {
        if (res) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).jsonp({ msg: errors.array() });

            }
            else {
                const check = `select e_id from expense where e_id=${req.params.id}`;
                con.query(check, (err, result) => {
                    if (result.length > 0) {
                        var sql = `update expense set e_name='${req.body.e_name}',e_amount=${req.body.e_amount},e_date='${req.body.e_date}' WHERE e_id=${req.params.id} and u_id=${req.user[0]['u_id']} `;
                        con.query(sql, (err, result) => {
                            if (err) {
                                res.send({ msg: err['sqlMessage']});
                                
                            }
                            else {
                               res.status(200).send({ msg: 'Expenses Details Updated..!' });
                            }
                        });
                    }
                    else{
                        res.send({msg:'Expenses Not Exists'});
                    }
                })

            }
        }
    } catch (error) {
        res.status(401).send({ msg:error.message })
    }

});

//Delete Expenses
expenses.delete("/delete/:id", auth, (req, res) => {
    try {
        var check = `select * from expense where e_id=${req.params.id}`
        con.query(check, (err, data) => {
            if (data.length == 0) {
                res.send({ msg: 'Expenses Already Deleted.!' });
            }
            else {
                var deleteauth = `select u_id from expense where e_id=${req.params.id}`
                con.query(check, (err, user) => {
                    if (user[0]['u_id'] != req.user[0]['u_id']) {
                        res.send({ msg: `You Can't Delete ` });
                    }
                    else {
                        var sql = `DELETE  FROM expense WHERE  e_id=${req.params.id}`;
                        con.query(sql, (err, result) => {
                            if (result) {
                                res.status(200).send({ msg: 'Expnses Deleted' })
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


module.exports = expenses