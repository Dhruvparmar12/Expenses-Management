const express = require('express');
const user = express.Router()
const cors = require('cors');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')
const dotenv = require('dotenv');
dotenv.config();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
user.use(cors());
const con = require('../connection/connection')
const auth = require('./auth');
const SECRET_KEY = process.env.SECRET;

//User Registration
user.post("/add", [
    check('u_name').not().isEmpty().withMessage('Cannot be Blank').matches(/^[a-zA-Z]+$/, "i").withMessage('please enter Only Alphabets And Max 50 character'),
    check('u_email', 'Please Enter the Valid Email Address').not().isEmpty().withMessage('Cannot be Blank').isEmail().withMessage('Please Enter the Valid Email Address'),
    check("u_password").not().isEmpty().withMessage('Cannot be Blank').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,20}$/, "i").withMessage("Password should be combination of one uppercase , one lower case, one digit and min 8 , max 20 char long"),
    check("c_password").not().isEmpty().withMessage('Cannot be Blank').custom((value, { req }) => (value === req.body.u_password)).withMessage('Password does not Match'),
    check('u_mobile').matches(/^[0][1-9]\d{9}$|^[1-9]\d{9,12}$/).withMessage('only number,Min 10, Max 13 length')

], (req, res) => {
    try {
        if (res) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors.array());
                return res.status(422).jsonp({ msg: errors.array() });
            }
            else {

                const password = bcrypt.hashSync(req.body.u_password, 10)
                const name = req.body.u_name;
                const email = req.body.u_email;
                const mobile = req.body.u_mobile;
                const userData = {
                    u_name: name,
                    u_email: email,
                    u_password: password,
                    u_mobile: mobile
                }
                var check = `select u_email from user where u_email='${email}'`
                con.query(check, (err, data) => {
                    if (data.length!=0) {
                        res.status(406).json({ msg: 'Email Already Exists' })
                    }
                    else {

                        var sql = `insert into user(u_name,u_email,u_password,u_mobile) values('${name}','${email}','${password}',${mobile})`;
                        con.query(sql, (err, result) => {
                            if (result) {
                            
                                res.status(201).json({ msg: 'Successfully Registered' });
                            }
                        });
                    }
                })
            }
        }
    }
    catch (error) {
<<<<<<< HEAD
        res.status(500).json({ msg: error })
=======
        res.status(500).send({ msg: error.message })
>>>>>>> splitwise
    }
});

//Login
user.post('/login', [
    check('u_email', 'Please Enter the Valid Email Address').not().isEmpty().withMessage('Cannot be Blank').isEmail().withMessage('Please Enter the Valid Email Address'),
    check("u_password").not().isEmpty().withMessage('Cannot be Blank')
], (req, res) => {
    try {
        if (res) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors.array());
                return res.status(422).jsonp({ msg: errors.array() });
            }
            else {
                const email = req.body.u_email;
                const password = req.body.u_password;
                data = {
                    email: email,
                    password: password
                }
                var que = `select * from user where u_email='${email}'`;
                con.query(que, (err, result) => {
                    if (result.length == 0) {
                        res.status(404).send({ msg: '*Email Id Does Not Exists' });
                    }
                    else {
                        if (bcrypt.compareSync(password, result[0].u_password)) {
                            let token = jwt.sign(data, SECRET_KEY, {
                                expiresIn: 1440
                            })
<<<<<<< HEAD
                            res.status(200).send({ token: token, u_id: result[0]['u_id'],msg:'LogIn SuccssFully' })
=======
                            res.status(200).json({ token: token, u_id: result[0]['u_id'],u_name:result[0]['u_name'], msg: 'Login Successfully..!' })
>>>>>>> splitwise

                        } else {
                            res.status(404).send({ msg: '*Password Does Not Match' })
                        }

                    }

                });

            }

        }
    }
    catch (error) {
        res.status(500).send({ msg: error.message })
    }


});

// All users
user.get('/alluser', auth, (req, res) => {
    try {

        const que = `select * from user `;
        con.query(que, (err, result) => {

            if (!result.length == 0) {
                res.status(200).json({ msg: result })
            }
            else {
                res.status(404).send({ msg: err['sqlMessage'] });
            }
        })
    }
    catch (error) {
        res.status(401).send({ msg: error.message })
    }
});

//Get Profile
user.get('/profile', auth, (req, res) => {
    try {
<<<<<<< HEAD
        var decoded = jwt.verify(req.headers['authorization'], SECRET_KEY)
        if (decoded) {
            const que = `select * from user where u_id='${decoded.u_id}'`;
            con.query(que, (err, result) => {
=======
>>>>>>> splitwise

        const que = `select * from user where u_email='${req.user[0]['u_email']}'`;
        con.query(que, (err, result) => {

            if (!result.length == 0) {
                res.status(200).json({ msg: result })
            }
            else {
                res.status(404).send({ msg: err['sqlMessage'] });
            }
        })
    }
    catch (error) {
        res.status(401).send({ msg: error.message })
    }
});

//Get Specific User Profile
user.get('/user/:id', auth, (req, res) => {
    try {
        const que = `select * from user where u_id='${req.params.id}'`;
        con.query(que, (err, result) => {

            if (!result.length == 0) {
                res.status(200).json({ msg: result })
            }
            else {
                res.status(404).send({ msg: err['sqlMessage'] })
            }
        })

    } catch (error) {
        res.status(401).send({ msg: error.message })
    }
});

//Update User Profile

user.patch('/update/:id', [
    check('u_name').not().isEmpty().withMessage('Cannot be Blank').matches(/^[a-zA-Z]+$/, "i").withMessage('please enter Only Alphabets And Max 50 character'),
    check('u_email', 'Please Enter the Valid Email Address').not().isEmpty().withMessage('Cannot be Blank').isEmail().withMessage('Please Enter the Valid Email Address'),
    check('u_mobile').matches(/^[0][1-9]\d{9}$|^[1-9]\d{9,12}$/).withMessage('only number,Min 10, Max 13 length')

],auth, (req, res) => {


    if (res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array());
            return res.status(422).jsonp({ msg: errors.array() });
        }
        else {
            try {
                
                const check = `select u_email from user where u_email='${req.body.u_email}'`
                con.query(check, (err, data) => {
                    if (data[0]['u_email'] != req.user[0]['u_email'] ) {
                        res.status(406).send({ msg: 'Email Already Used.!' })
                    }
                    else {
                        const que = `update user set u_name='${req.body.u_name}',u_email='${req.body.u_email}',u_mobile=${req.body.u_mobile} where u_id='${req.params.id}'`;
                        con.query(que, (err, result) => {
                            if (result) {
                                res.status(201).json({ msg: 'Profile Updated..!' });
                            }
                            else {
                                res.status(400).send({ msg: 'User Does not Exists' });
                            }
                        })
                    }
                })

            } catch (error) {
                res.status(401).send({ msg: error.message })
            }
        }
    }
})

//Delete Account

user.delete("/delete/:id", (req, res) => {
    try {
        if (jwt.verify(req.headers['authorization'], SECRET_KEY)) {

            const que = `DELETE  FROM user WHERE u_id=${req.params.id}`;
            con.query(que, (err, result) => {
                if (result) {
                    res.status(200).send({ msg: 'Profile Deleted..!' });
                }
            })
        }
    } catch (error) {
        res.status(401).send({ msg: 'Unauthorized User' });
    }
})

//ForgetPassword

user.post('/forgetpassword', [
    check('u_email', 'Please Enter the Valid Email Address').not().isEmpty().withMessage('Cannot be Blank').isEmail().withMessage('Please Enter the Valid Email Address'),

], (req, res) => {
    try {
        if (res) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors.array());
                return res.status(422).jsonp({ msg: errors.array() });
            } else {
                const body = `<h3>Go to this Link and Reset your Password</h3>
                <br>
                <a href="http://localhost:4200/passwordreset">Forgot Password</a>`
                const que = `select u_email from user where u_email='${req.body.u_email}'`;
                con.query(que, (err, result) => {
                    if (result.length == 0) {
                        res.status(400).send({ msg: 'User Does not Exists' });
                    }
                    else {
                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'dhruv.parmar.sa@gmail.com',
                                pass: 'rd7600959694'
                            }
                        });


                        const mailOptions = {
                            from: 'dhruv.parmar.sa@gmail.com',
                            to: req.body.u_email,
                            subject: 'Password Recover',
                            html: body
                        };


                        transporter.sendMail(mailOptions, (err, info) => {
                            if (info) {
                                res.status(200).send({ msg: 'Mail Sent..! Please Check Your Mail and Change Password' })
                            } else {
                                res.send(err)
                            }


                        });
                    }

                })
            }
        }
    } catch (error) {
        res.status(401).send({ msg: 'Invalid' })
    }
})

//Update Password

user.patch('/resetpassword', [
    check('u_email', 'Please Enter the Valid Email Address').not().isEmpty().withMessage('Cannot be Blank').isEmail().withMessage('Please Enter the Valid Email Address'),
    check("u_password").not().isEmpty().withMessage('Cannot be Blank').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,20}$/, "i").withMessage("Password should be combination of one uppercase , one lower case, one digit and min 8 , max 20 char long"),
    check("c_password").not().isEmpty().withMessage('Cannot be Blank').custom((value, { req }) => (value === req.body.u_password)).withMessage('Password does not Match'),

], (req, res) => {
    try {
        if (res) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors.array());
                return res.status(422).jsonp({ msg: errors.array() });
            }
            else {
                const check = `select u_email from user where u_email='${req.body.u_email}'`
                con.query(check, (err, data) => {
                    if (data.length == 0) {
                        res.status(406).send({ mgs: 'User Not Exists.!' })
                    } else {
                        u_password = bcrypt.hashSync(req.body.u_password, 10);
                        const que = `update user set u_password='${u_password}' where u_email='${req.body.u_email}'`;
                        con.query(que, (err, result) => {
                            if (result) {
                                res.status(201).send({ msg: 'Password Updated' })
                            }
                            else {
                                res.status(401).send({ msg: 'Password Not Updated' })
                            }
                        })
                    }
                })

            }
        }
    }
    catch (error) {

        res.status(401).send({ msg: 'Invalid' })
    }
})

user.patch('/changepassword', [
    check('u_id', 'Please Enter the User Id').not().isEmpty().withMessage('Cannot be Blank'),
    check("u_password").not().isEmpty().withMessage('Cannot be Blank').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,20}$/, "i").withMessage("Password should be combination of one uppercase , one lower case, one digit and min 8 , max 20 char long"),
    check("c_password").not().isEmpty().withMessage('Cannot be Blank').custom((value, { req }) => (value === req.body.u_password)).withMessage('Password does not Match'),

], (req, res) => {
    try {
        if (res) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors.array());
                return res.status(422).jsonp({ msg: errors.array() });
            }
            else {
                if (jwt.verify(req.headers['authorization'], SECRET_KEY)) {
                    const check = `select * from user where u_id='${req.body.u_id}'`
                    con.query(check, (err, data) => {
                        if (data.length == 0) {
                            res.status(406).send({ mgs: 'User Not Exists.!' })
                        } else {
                            u_password = bcrypt.hashSync(req.body.u_password, 10);
                            const que = `update user set u_password='${u_password}' where u_id=${req.body.u_id}`;
                            con.query(que, (err, result) => {
                                console.log(result)
                                if (result) {
                                    res.status(201).send({ msg: 'Password Updated' })
                                }
                                else {
                                    res.status(401).send({ msg: err })
                                }
                            })
                        }
                    })

                }


            }
        }
    }
    catch (error) {

        res.status(401).send({ msg: 'Unauthorized User..!' })
    }
})


module.exports = user;