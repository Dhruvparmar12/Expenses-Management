const express = require('express');
const expenses = express.Router()
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const { check, validationResult } = require('express-validator');
expenses.use(cors());
const con = require('../connection/connection')
const SECRET_KEY = process.env.SECRET;

//Add expenses
expenses.post("/add", [
    check('e_name').not().isEmpty().withMessage('Cannot be Blank'),
    check('e_amount').not().isEmpty().withMessage('Cannot be Blank'),
    check('e_date').not().isEmpty().withMessage('Cannot be Blank')


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
                    const check = `select u_id from user where u_email='${decoded.email}'`
                    con.query(check, (err, data) => {
                        if (data.length != 0) {
                            var sql = `insert into expense (u_id,e_name,e_amount,e_date) values(${data[0]['u_id']},'${req.body.e_name}','${req.body.e_amount}','${req.body.e_date}')`
                            con.query(sql, (err, result) => {
                                if (result) {
                                    res.status(200).send({ msg: 'Expenses Added' })
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

//All Expenses
expenses.get("/allexpenses", (req, res) => {
    try {
        const decoded = jwt.verify(req.headers['authorization'], SECRET_KEY)
        if (decoded) {
            const check = `select u_id from user where u_email='${decoded.email}'`
            con.query(check, (err, data) => {
                if (data.length != 0) {
                    var sql = `select * FROM expense WHERE u_id=${data[0]['u_id']}`;
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

//All Expenses
expenses.get("/:id", (req, res) => {
    try {
        const decoded = jwt.verify(req.headers['authorization'], SECRET_KEY)
        if (decoded) {
            const check = `select u_id from user where u_email='${decoded.email}'`
            con.query(check, (err, data) => {
                if (data.length != 0) {
                    var sql = `select * FROM expense WHERE e_id=${req.params.id}`;
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

});

//update expenses
expenses.patch("/update/:id", [
    check('e_name').not().isEmpty().withMessage('Cannot be Blank'),
    check('e_amount').not().isEmpty().withMessage('Cannot be Blank'),
    check('e_date').not().isEmpty().withMessage('Cannot be Blank')
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
                    const check = `select u_id from user where u_email='${decoded.email}'`
                    con.query(check, (err, data) => {
                        if (data.length != 0) {
                            var sql = `update expense set e_name='${req.body.e_name}',e_amount=${req.body.e_amount},e_date='${req.body.e_date}' WHERE e_id=${req.params.id} and u_id=${data[0]['u_id']} `;
                            con.query(sql, (err, result) => {
                                if (result) {
                                    res.status(200).send({ msg: 'Expenses Details Updated..!' })
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
    } catch (error) {
        res.status(401).send({ msg: '`You are Not Authorized`' })
    }

});

//Delete Expenses
expenses.delete("/delete/:id", (req, res) => {
    try {
        const decoded = jwt.verify(req.headers['authorization'], SECRET_KEY)
        if (decoded) {
            const check = `select u_id from user where u_email='${decoded.email}'`
            con.query(check, (err, data) => {
                if (data.length != 0) {
                    var sql = `DELETE  FROM expense WHERE e_id=${req.params.id} and u_id=${data[0]['u_id']}`;
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
    }
    catch (error) {
        res.status(401).send({ msg: `You can not be Delete..!` })
    }
});

module.exports = expenses