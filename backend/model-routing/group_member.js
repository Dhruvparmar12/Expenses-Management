const express = require('express');
const member = express.Router()
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const { check, validationResult } = require('express-validator');
member.use(cors());
const con = require('../connection/connection')
const auth = require('./auth');

member.post("/add", [
    check('g_id').not().isEmpty().withMessage('Cannot be Blank'),
    check('u_id').not().isEmpty().withMessage('Cannot be Blank'),
], auth, (req, res) => {
    try {
        if (res) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).jsonp({ msg: errors.array() });
            }
            else {
                const check = `select u_id from user where u_id=${req.body.u_id}`
                con.query(check, (err, result) => {
                    if (result.length > 0) {
                        const check = `select g_id from groups where g_id=${req.body.g_id}`
                        con.query(check, (err, result) => {
                            if (result.length > 0) {
                                const check = `select u_id from groups_member where u_id=${req.body.u_id} and g_id=${req.body.g_id}`;
                                con.query(check, (err, result) => {
                                    if (result.length > 0) {
                                        res.send({ msg: 'Member Already Exists' });
                                    }
                                    else {
                                        const sql = `insert into groups_member(g_id,u_id) values(${req.body.g_id},${req.body.u_id})`
                                        con.query(sql, (err, result) => {
                                            if (result) {
                                                res.status(200).send({ msg: 'Member Added..!' })
                                            }
                                            else {
                                                res.status(422).send({ msg: err['sqlMessage'] });
                                            }
                                        });

                                    }
                                })

                            }
                            else {
                                res.send({ msg: 'Group Not Existed.!' });
                            }
                        })
                    } else {
                        res.send({ msg: 'User Not Existed.!' });

                    }
                })

            }
        }
    }
    catch (error) {
        res.status(401).send({ msg: error.message })
    }
});

member.delete("/delete/:id", auth, (req, res) => {

    try {
        const check = `select g_m_id from groups_member WHERE  g_m_id=${req.params.id}`
        con.query(check, (err, result) => {
            if (result.length > 0) {
                var sql = `DELETE  FROM groups_member WHERE  g_m_id=${req.params.id}`;
                con.query(sql, (err, result) => {
                    if (err) {
                        res.status(422).send({ msg: err['sqlMessage'] });
                    }
                    else {

                        res.status(200).send({ msg: 'Member Deleted' });
                    }
                });
            }
            else {
                res.send({ msg: 'Member Already Deleted.!' });
            }
        })
    }
    catch (error) {
        res.status(401).send({ msg: error.message });
    }
});

module.exports = member;