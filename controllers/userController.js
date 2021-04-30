const mysql = require('../mysql')
const bcrypt = require('bcrypt');
const EncryptDep = require('../controllers/encryption')
const IMG_USER = 'https://www.kauavitorio.com/host-itens/Default_Profile_Image_palacepetz.png';

//  Method for login user
exports.Login = async (req, res, next) => {
    try{
        var query = `SELECT * FROM tbl_account WHERE email = ?`;
        var results = await mysql.execute(query, req.body.email);
        if(results.length > 0){
            const response = {
                id_user: results[0].id_user,
                name_user: EncryptDep.Decrypt(results[0].name_user),
                email: results[0].email,
                cpf_user: EncryptDep.Decrypt(results[0].cpf_user),
                address_user: EncryptDep.Decrypt(results[0].address_user),
                complement: EncryptDep.Decrypt(results[0].complement),
                zipcode: EncryptDep.Decrypt(results[0].zipcode),
                phone_user: EncryptDep.Decrypt(results[0].phone_user),
                user_type: results[0].user_type,
                img_user: EncryptDep.Decrypt(results[0].img_user)
            }
            return res.status(200).send(response);
        }else{
            return res.status(404).send({ message: 'User not registered' })
        }
    }catch (error){
        return res.status(500).send({ error: error})
    }
}

//  Method for register new user
exports.RegisterUsers = async (req, res, next) => {
    try {
        var query = `SELECT * FROM tbl_account WHERE email = ?`;
        var result_Validuser = await mysql.execute(query, req.body.email);
        if(result_Validuser.length > 0){
            return res.status(409).send({ message: 'User already registered' })
        }else{
            const hash = await bcrypt.hashSync(req.body.password, 12);
            query = 'INSERT INTO tbl_account (name_user, email, cpf_user, password, img_user) VALUES (?,?,?,?,?)';
            var results = await mysql.execute(query, [ EncryptDep.Encrypto(req.body.name_user), req.body.email,
                EncryptDep.Encrypto(req.body.cpf_user), hash, EncryptDep.Encrypto(IMG_USER)])
            //  Creating resposto to return
            const response = {
                message: 'User created successfully',
                createdUser: {
                    userId: results.insertId,
                    name_user: req.body.name_user
                }
            }
            return res.status(201).send(response);
        }
    } catch (error) {
        return res.status(500).send( { error: error } )
    }
}

exports.UpdateAddress = async (req, res, next) => {
    try {
        var query = `UPDATE tbl_account SET address_user = ?,
        complement = ?, zipcode = ? WHERE id_user = ?`
        await mysql.execute(query, [ EncryptDep.Encrypto(req.body.address_user), EncryptDep.Encrypto(req.body.complement), EncryptDep.Encrypto(req.body.zipcode), req.body.id_user ])
        return res.status(202).send({ message: 'Address updated successfully !!'})
    } catch (error) {
        return res.status(500).send( { error: error } )
    }
}