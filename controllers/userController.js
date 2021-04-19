const mysql = require('../mysql')
const bcrypt = require('bcrypt');

//  Method for register new user
exports.RegisterUser = async (req, res, next) => {
    try {
        var query = `SELECT * FROM tbl_account WHERE email = ?`;
        var result_Validuser = await mysql.execute(query, [req.body.email]);
        if(result_Validuser.length > 0){
            return res.status(409).send({ message: 'User already registered' })
        }else{
            const hash = await bcrypt.hashSync(req.body.password, 10);
            query = 'INSERT INTO tbl_account (email, nm_user, password, type_user) VALUES (?,?,?,?)';
            var results = await mysql.execute(query, [res.body.email, res.body.nm_user, hash, res.body.type_user])

            const response = {
                message: 'User created successfully',
                createdUser: {
                    userId: results.insertId,
                    nm_user: req.body.nm_user
                }
            }
            return res.status(201).send(response);
        }

    } catch (error) {
        return res.status(500).send({ error: error })
    }
}