const con = require('../connection/connection');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const SECRET_KEY = process.env.SECRET;

const auth = (req, res, next) => {
    try {
        const decoded = jwt.verify(req.headers['authorization'], SECRET_KEY);
        if (decoded) {
            const check = `select * from user where u_email='${decoded.email}'`
            con.query(check, (err, result) => {
                if (result.length != 0) {
                    req.user = result
                    next();
                }
                else {
                    res.status(404).send({ msg: err['sqlMessage'] })
                }
            })
        }
    } catch (err) {
        res.status(404).send({ msg: 'You are not authorized.' })
    }
}
module.exports = auth;