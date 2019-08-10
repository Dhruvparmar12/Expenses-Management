const express = require('express');
const splitexpenses = express.Router()
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const { check, validationResult } = require('express-validator');
splitexpenses.use(cors());
const con = require('../connection/connection')
const auth = require('./auth');
//Add expenses
splitexpenses.post("/add", [
    check('e_name').not().isEmpty().withMessage('Cannot be Blank'),
    check('e_amount').not().isEmpty().withMessage('Cannot be Blank'),
    check('e_date').not().isEmpty().withMessage('Cannot be Blank'),
    check('g_id').not().isEmpty().withMessage('Cannot be Blank'),
], auth, (req, res) => {
    try {
        if (res) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).jsonp({ msg: errors.array() });
            }
            else {
                const check = `select * from groups where g_id=${req.body.g_id}`
                con.query(check, (err, data) => {
                    if (data.length == 0) {
                        res.send({ msg: 'Group Does not Exists' });
                    } else {
                        var sql = `insert into split_expense (u_id,g_id,e_name,e_amount,e_date) values(${req.user[0]['u_id']},${req.body.g_id},'${req.body.e_name}',${req.body.e_amount},'${req.body.e_date}')`
                        con.query(sql, (err, result) => {
                            if (result) {
                                const count_member = `SELECT count(g_m_id) as member from groups_member where g_id=${req.body.g_id}`;
                                con.query(count_member, (err, count) => {
                                    if (count.length > 0) {
                                        const member = count[0]["member"]
                                        splitamount = req.body.e_amount / member;

                                        const total_member = `SELECT u_id from groups_member where g_id=${req.body.g_id}`;
                                        con.query(total_member, (err, data) => {
                                            if (data.length > 0) {
                                                for (let i of data) {
                                                    let splitdata = `insert into split_bill(s_e_id,u_id,g_id,amount,status) values(${result['insertId']},${i.u_id},${req.body.g_id},${splitamount},'unpaid')`;
                                                    if (i.u_id == req.user[0]['u_id']) {
                                                        splitdata = `insert into split_bill(s_e_id,u_id,g_id,amount,status) values(${result['insertId']},${i.u_id},${req.body.g_id},${splitamount},'paid')`;
                                                    }
                                                    con.query(splitdata, (err, result) => {
                                                        if (err) {

                                                            res.status(422).send({ msg: err['sqlMessage'] });
                                                        }
                                                    })
                                                }
                                                res.send({ msg: `Expenses Add and Split with ${member} Person` })

                                            } else {
                                                res.send({ msg: 'No Member In this Group..!' })
                                            }
                                        })
                                    }
                                })

                            }
                            else {
                                res.status(422).send({ msg: err['sqlMessage'] });
                            }
                        });
                    }
                })

            }
        }
    }
    catch (error) {
        res.status(401).send({ msg: error });
    }
}); 

splitexpenses.get("/allexpenses", auth, (req, res) => {
    try {
        var sql = `SELECT user.u_name,groups.g_name,split_expense.* FROM split_bill 
        JOIN split_expense ON split_expense.s_e_id=split_bill.s_e_id 
        JOIN user on user.u_id=split_expense.u_id 
        JOIN groups on split_bill.g_id=groups.g_id WHERE split_expense.u_id = ${req.user[0]['u_id']} OR split_bill.u_id =${req.user[0]['u_id']} group by split_expense.s_e_id`;
        con.query(sql, (err, result) => {
            if (result) {
                res.status(200).send(result)
            }
            else {
                res.status(422).send({ msg: err['sqlMessage'] })
            }
        });
    } catch (error) {
        res.status(401).send({ msg: error })
    }

});

splitexpenses.get("/allmember/:id", auth, (req, res) => {
    try {
        var sql = `SELECT user.u_id,user.u_name,split_bill.amount,split_bill.status,split_bill.s_b_id from user join split_bill on user.u_id=split_bill.u_id WHERE s_e_id=${req.params.id}`;
        con.query(sql, (err, result) => {
            if (result) {
                res.status(200).send(result)
            }
            else {
                res.status(422).send({ msg: err['sqlMessage'] });
            }
        });
    } catch (error) {
        res.status(401).send({ msg: error })
    }

});

splitexpenses.patch("/update/:id", auth, (req, res) => {
    try {

        var sql = `UPDATE split_bill SET status = '${req.body.status}' WHERE s_e_id =${req.params.id} and u_id=${req.user[0]['u_id']}`;
        con.query(sql, (err, result) => {
            if (err) {
                res.send({ msg: err['sqlMessage'] });

            }
            else {
                res.status(200).send({ msg: 'Expenses Details Updated..!' });
            }
        });
    } catch (error) {
        res.status(401).send({ msg: '`You are Not Authorized`' })
    }

});

splitexpenses.get("/amount", auth, (req, res) => {
    try {
        var sql = `select sum(amount) as Land from split_expense join split_bill ON split_expense.s_e_id=split_bill.s_e_id where split_expense.u_id=${req.user[0]['u_id']} and split_bill.status='unpaid'`;
        con.query(sql, (err, result) => {
            if (result.length > 0) {
                var sql1 = `SELECT sum(amount) as Borrow FROM split_bill WHERE split_bill.u_id=${req.user[0]['u_id']}  AND split_bill.status='unpaid'`;
                con.query(sql1,(err,data)=>{
                    if(data.length>0){
                        res.send({Land:result,Borrow:data});
                    }
                    else{
                        res.status(404).send({ msg: 'No Amount You Lent' });
                    }
                })

            }
            else {
                res.status(404).send({ msg: 'No Amount You Borrow' });
            }
        });
    } catch (error) {
        res.status(401).send({ msg: error })
    }

});


//SELECT sum(amount) FROM `split_bill` WHERE split_bill.u_id=1 AND split_bill.status='unpaid';
module.exports = splitexpenses;

