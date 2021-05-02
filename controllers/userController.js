const mysql = require('../mysql')
const bcrypt = require('bcrypt');
const EncryptDep = require('../controllers/encryption')
const ServerDetails = require('../ServerError') 
const BadWords = require('../controllers/badWords') 
const IMG_USER = 'https://www.kauavitorio.com/host-itens/Default_Profile_Image_palacepetz.png';

//  Method for login user
exports.Login = async (req, res, next) => {
    try{
        const resultList = await mysql.execute('SELECT * FROM tbl_account;')
        if(resultList.length > 0){
            for(var i = 0 ; i < resultList.length; i++){
                var email = EncryptDep.Decrypt(resultList[i].email);
                if(email == req.body.email ){
                    console.log('Email found')
                        const response = {
                            id_user: resultList[i].id_user,
                            name_user: EncryptDep.Decrypt(resultList[i].name_user),
                            email: EncryptDep.Decrypt(resultList[i].email),
                            cpf_user: EncryptDep.Decrypt(resultList[i].cpf_user),
                            address_user: EncryptDep.Decrypt(resultList[i].address_user),
                            complement: EncryptDep.Decrypt(resultList[i].complement),
                            zipcode: EncryptDep.Decrypt(resultList[i].zipcode),
                            phone_user: EncryptDep.Decrypt(resultList[i].phone_user),
                            user_type: resultList[i].user_type,
                            img_user: EncryptDep.Decrypt(resultList[i].img_user)
                        }
                        return res.status(200).send(response);
                }
            }
        }else{
            ServerDetails.RegisterServerError("Search for user email", "No email on database");
            console.log('No email on database')
            return res.status(500).send({ error: "No email on database"})
        }
    }catch (error){
        ServerDetails.RegisterServerError("Login User", error.toString());
        return res.status(500).send({ error: error})
    }
}

//  Method for register new user
exports.RegisterUsers = async (req, res, next) => {
    try {
        if(BadWords.VerifyUsername(req.body.name_user)){
            return res.status(406).send({ error: "Username not allowed"})
        }else{
            var Emailcollection = [];
            const resultList = await mysql.execute('SELECT * FROM tbl_account;')
            if(resultList.length > 0){
                for(var i = 0 ; i < resultList.length; i++){
                var email = EncryptDep.Decrypt(resultList[i].email);
                    if(email == req.body.email ){
                        Emailcollection.push(i)
                    }
                }
            if(Emailcollection.length > 0){
                return res.status(409).send({ message: 'User already registered' })
            }else{
                const hash = await bcrypt.hashSync(req.body.password, 12);
                query = 'INSERT INTO tbl_account (name_user, email, cpf_user, password, img_user) VALUES (?,?,?,?,?)';
                var results = await mysql.execute(query, [ EncryptDep.Encrypto(req.body.name_user), EncryptDep.Encrypto(req.body.email),
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
        }else{
            const hash = await bcrypt.hashSync(req.body.password, 12);
                query = 'INSERT INTO tbl_account (name_user, email, cpf_user, password, img_user) VALUES (?,?,?,?,?)';
                var results = await mysql.execute(query, [ EncryptDep.Encrypto(req.body.name_user), EncryptDep.Encrypto(req.body.email),
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
        }
    } catch (error) {
        ServerDetails.RegisterServerError("Register User", error.toString());
        return res.status(500).send( { error: error } )
    }
}

// Method for Register Address
exports.UpdateAddress = async (req, res, next) => {
    try {
        var queryUser = `SELECT * FROM tbl_account where id_user = ?`
        var result  = await mysql.execute(queryUser, [req.body.id_user])
        if(result.length > 0){
            var query = `UPDATE tbl_account SET address_user = ?,
            complement = ?, zipcode = ? WHERE id_user = ?`
            await mysql.execute(query, [ EncryptDep.Encrypto(req.body.address_user), EncryptDep.Encrypto(req.body.complement), EncryptDep.Encrypto(req.body.zipcode), req.body.id_user ])
            return res.status(202).send({ message: 'Address updated successfully !!'})
        }else{
            return res.status(404).send({ message: 'User not registered' })
        }
    } catch (error) {
        ServerDetails.RegisterServerError("Update Address", error.toString());
        return res.status(500).send( { error: error } )
    }
}