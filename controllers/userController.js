const mysql = require('../mysql')
const bcrypt = require('bcrypt');
const EncryptDep = require('../controllers/encryption')
const ServerDetails = require('../ServerError') 
const BadWords = require('../controllers/badWords')
const Emails = require('./email')
const IMG_USER = 'https://www.kauavitorio.com/host-itens/Default_Profile_Image_palacepetz.png';
var requestId = 0;

//  Method for login user
exports.Login = async (req, res, next) => {
    try{
        showRequestId()
        var Userlist = []
        var email = req.body.email
        var password = req.body.password
        var id_user = 0;
        const resultList = await mysql.execute('SELECT * FROM tbl_account;')
        if(resultList.length > 0){
            for(var i = 0 ; i < resultList.length; i++){
                var emailGet = EncryptDep.Decrypt(resultList[i].email);
                if(emailGet == email){
                    id_user = resultList[i].id_user
                    Userlist.push(id_user)
                }
            }
            if(Userlist.length > 0){
                const result = await mysql.execute('SELECT * FROM tbl_account WHERE id_user = ?', id_user)
                if(result.length > 0){
                const match = await bcrypt.compareSync(password, result[0].password);
                if(match){
                    var verify_id = result[0].verify_id
                    var verify = result[0].verify
                    const response = {
                        id_user: result[0].id_user,
                        name_user: EncryptDep.Decrypt(result[0].name_user),
                        email: EncryptDep.Decrypt(result[0].email),
                        cpf_user: EncryptDep.Decrypt(result[0].cpf_user),
                        address_user: EncryptDep.Decrypt(result[0].address_user),
                        complement: EncryptDep.Decrypt(result[0].complement),
                        zipcode: EncryptDep.Decrypt(result[0].zipcode),
                        phone_user: EncryptDep.Decrypt(result[0].phone_user),
                        birth_date: EncryptDep.Decrypt(result[0].birth_date),
                        user_type: result[0].user_type,
                        img_user: EncryptDep.Decrypt(result[0].img_user)
                    }
                if(verify_id == "Confirmed" || verify == 1){
                    return res.status(200).send(response);
                }else{
                    return res.status(405).send( {message: 'Email is not verified !!'} );
                }
                }else{
                    return res.status(401).send({ message: "Password or email invalid" });
                }
                }
            }else{
                return res.status(401).send({ message: "Password or email invalid" });
            }
        }else{
            console.log('No email on database')
            return res.status(500).send({ error: "No email on database"})
        }
    }catch (error){
        ServerDetails.RegisterServerError("Login User", error.toString());
        return res.status(500).send({ error: error.toString()})
    }
}



//  Method for register new user
exports.RegisterUsers = async (req, res, next) => {
    try {
        showRequestId()
        if(BadWords.VerifyUsername(req.body.name_user)){
            return res.status(406).send({ error: "Username not allowed"})
        }else{
            var Emailcollection = [];
            const resultList = await mysql.execute('SELECT email FROM tbl_account;')
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
                var idVerifyEMail = makeidForUser(2) + "-Pala"+ makeidForUser(1) +"cePetz-" + "a" + makeidForUser(1) + "l"+ makeidForUser(3) + "a"+ makeidForUser(1) + "c"+ makeidForUser(1) + "e"+ makeidForUser(1) + makeidForUser(9) + "-Pala"+ makeidForUser(1) +"cePetz-" + makeidForUser(2)
                const hash = await bcrypt.hashSync(req.body.password, 12);
                query = 'INSERT INTO tbl_account (name_user, email, cpf_user, password, img_user, verify_id) VALUES (?,?,?,?,?,?)';
                var results = await mysql.execute(query, [ EncryptDep.Encrypto(req.body.name_user), EncryptDep.Encrypto(req.body.email),
                    EncryptDep.Encrypto(req.body.cpf_user), hash, EncryptDep.Encrypto(IMG_USER), idVerifyEMail])

                //  Sending email for new user
                var resultEmail = Emails.SendEmailConfirmation(req.body.email, req.body.name_user, process.env.URL_API + "user/confirm/email/" + idVerifyEMail + "/" + results.insertId)
                //  Creating resposto to return
                const response = {
                    message: 'User created successfully',
                    createdUser: {
                        userId: results.insertId,
                        name_user: req.body.name_user
                    }
                }
                if(resultEmail == "Sent"){
                    return res.status(201).send(response);
                }else{
                    return res.status(201).send(response);
                }
            }
        }else{
                var idVerifyEMail = makeidForUser(2) + "-Pala"+ makeidForUser(1) +"cePetz-" + "a" + makeidForUser(1) + "l"+ makeidForUser(3) + "a"+ makeidForUser(1) + "c"+ makeidForUser(1) + "e"+ makeidForUser(1) + makeidForUser(9) + "-Pala"+ makeidForUser(1) +"cePetz-" + makeidForUser(2)
                const hash = await bcrypt.hashSync(req.body.password, 12);
                query = 'INSERT INTO tbl_account (name_user, email, cpf_user, password, img_user, verify_id) VALUES (?,?,?,?,?,?)';
                var results = await mysql.execute(query, [ EncryptDep.Encrypto(req.body.name_user), EncryptDep.Encrypto(req.body.email),
                    EncryptDep.Encrypto(req.body.cpf_user), hash, EncryptDep.Encrypto(IMG_USER), idVerifyEMail])

                //  Sending email for new user
                var resultEmail = Emails.SendEmailConfirmation(req.body.email, req.body.name_user, process.env.URL_API + "user/confirm/email/" + idVerifyEMail + "/" + results.insertId)
                //  Creating resposto to return
                const response = {
                    message: 'User created successfully',
                    createdUser: {
                        userId: results.insertId,
                        name_user: req.body.name_user
                    }
                }
                if(resultEmail == "Sent"){
                    return res.status(201).send(response);
                }else{
                    return res.status(201).send(response);
                }
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
        showRequestId()
        var queryUser = `SELECT * FROM tbl_account where id_user = ?`
        var result  = await mysql.execute(queryUser, [req.body.id_user])
        if(result.length > 0){
            var query = `UPDATE tbl_account SET address_user = ?,
            complement = ?, zipcode = ? WHERE id_user = ?`
            await mysql.execute(query, [ EncryptDep.Encrypto(req.body.address_user), EncryptDep.Encrypto(req.body.complement), EncryptDep.Encrypto(req.body.zipcode), req.body.id_user ])
            return res.status(202).send({ message: 'Address updated successfully !!'})
        }else{
            return res.status(400).send({ message: 'User not registered update Address' })
        }
    } catch (error) {
        ServerDetails.RegisterServerError("Update Address", error.toString());
        return res.status(500).send( { error: error } )
    }
}

//  Method for Update Profile Image
exports.UpdateProfileImage = async (req, res, next) => {
    try{
        showRequestId()
        var query;
        var URL_ProfileImage = EncryptDep.Encrypto(req.body.img_user)
        var ID_User = req.body.id_user
        query = `SELECT * FROM tbl_account WHERE id_user = ?`
        var result = await mysql.execute(query, ID_User)

        if(result.length > 0){
            if(URL_ProfileImage != "" || URL_ProfileImage.length >= 8 || URL_ProfileImage != null){
                query = 'UPDATE tbl_account SET img_user = ? WHERE id_user = ?'
                await mysql.execute(query, [URL_ProfileImage, ID_User])
                return res.status(200).send({ message: 'Update Image successfully !!' })
            }
        }else{
            return res.status(404).send({ message: 'User not registered' })
        }
    }catch(error){
        ServerDetails.RegisterServerError("Update Profile Image", error.toString());
        return res.status(500).send( { error: error } )
    }
}

//  Method for Update Profile
exports.UpdateProfile = async (req, res, next) => {
    try{
        showRequestId()
        var queryUser = `SELECT * FROM tbl_account WHERE id_user = ?;`
        var result = await mysql.execute(queryUser, req.body.id_user)
        if(result.length > 0){
            if(BadWords.VerifyUsername(req.body.name_user)){
                return res.status(406).send({ error: "Username not allowed"})                
            }else{
                var query = `UPDATE tbl_account SET 
                name_user = ?,
                cpf_user = ?,
                address_user = ?, 
                complement = ?, 
                zipcode = ?, 
                phone_user = ?, 
                birth_date = ?
                    WHERE id_user = ?;`
                await mysql.execute(query, [EncryptDep.Encrypto(req.body.name_user), EncryptDep.Encrypto(req.body.cpf_user), EncryptDep.Encrypto(req.body.address_user), EncryptDep.Encrypto(req.body.complement), EncryptDep.Encrypto(req.body.zipcode), EncryptDep.Encrypto(req.body.phone_user), EncryptDep.Encrypto(req.body.birth_date), req.body.id_user])
                return res.status(200).send( { message: 'User information successfully update'} )
            }
        }else{
            return res.status(404).send( { message: 'User not registered' } )
        }
    }catch(error){
        ServerDetails.RegisterServerError("Update Profile", error.toString());
        return res.status(500).send( { error: error } )
    }
}

//  Method for register new card
exports.RegisterNewCard = async (req, res, next) => {
    var nmUser_card = req.body.nmUser_card;
    var id_user = req.body.id_user;
    try {
        showRequestId()
        var queryUser = `SELECT * FROM tbl_account WHERE id_user = ?;`
        var resultUser = await mysql.execute(queryUser, id_user)
        if(resultUser.length > 0){
            var queryCardVerify = `SELECT number_card FROM tbl_cards WHERE id_user = ?;`
            var resultCardVerify = await mysql.execute(queryCardVerify, id_user)
            if(resultCardVerify.length > 0){
                var NumberCardList = [];
                for(var i = 0 ; i < resultCardVerify.length; i++){
                    var number_card = EncryptDep.Decrypt(resultCardVerify[i].number_card);
                        if(number_card == req.body.number_card ){
                            NumberCardList.push(i)
                        }
                    }
            if(NumberCardList.length > 0){
                return res.status(409).send({ message: 'Card already registered' })
            }else{
                if(BadWords.VerifyUsername(nmUser_card)){
                    return res.status(406).send({ error: "Card name not allowed"})                
                }else{
                    const query = `INSERT INTO tbl_cards (id_user, flag_card, number_card, shelflife_card, cvv_card, nmUser_card) VALUES (?,?,?,?,?,?)`
                    var result  = await mysql.execute(query, [ id_user, EncryptDep.Encrypto(req.body.flag_card), EncryptDep.Encrypto(req.body.number_card), EncryptDep.Encrypto(req.body.shelflife_card), EncryptDep.Encrypto(req.body.cvv_card), EncryptDep.Encrypto(nmUser_card) ] )
                    const response = {
                        message: "User created successfully",
                        cd_card: result.insertId
                    }
                    return res.status(201).send(response);
                }
            }
            }else{
                if(BadWords.VerifyUsername(nmUser_card)){
                    return res.status(406).send({ error: "Card name not allowed"})                
                }else{
                    const query = `INSERT INTO tbl_cards (id_user, flag_card, number_card, shelflife_card, cvv_card, nmUser_card) VALUES (?,?,?,?,?,?)`
                    var result  = await mysql.execute(query, [ id_user, EncryptDep.Encrypto(req.body.flag_card), EncryptDep.Encrypto(req.body.number_card), EncryptDep.Encrypto(req.body.shelflife_card), EncryptDep.Encrypto(req.body.cvv_card), EncryptDep.Encrypto(nmUser_card) ] )
                    const response = {
                        message: "User created successfully",
                        cd_card: result.insertId
                    }
                    return res.status(201).send(response);
                }
            }
        }else{
            return res.status(404).send( { message: 'User not registered' } )
        }
    } catch (error) {
        ServerDetails.RegisterServerError("Register New Card", error.toString());
        return res.status(500).send( { error: error } )
    }
}

exports.ConfirmEmail = async (req, res, next) => {
    try {
    var verify_id = req.params.verify_id
    var id_user = req.params.id_user
    if(verify_id == null || verify_id == " " || verify_id == "" || id_user == null || id_user == " " || id_user == ""){
        res.status(500).send({ message: 'Erro ao receber suas informações, tente novamente mais tarde.' })
    }else{
        const resultList = await mysql.execute('SELECT verify_id FROM tbl_account WHERE id_user = ?;', id_user)
        if(resultList.length > 0){
            console.log(resultList[0].verify_id)
            if(resultList[0].verify_id == verify_id){
                const queryUpdate = `UPDATE tbl_account set verify_id = "Confirmed", verify = 1 WHERE id_user = ?`
                await mysql.execute(queryUpdate, id_user);
                res.writeHead(302, { 'Location': process.env.URL_API + 'emailconfirmed' });
                res.end();
            }else{
                return res.status(409).send({ message: 'Email já verificado!!' })
            }
        }else{
            return res.status(404).send( { message: 'User not registered' } )
        }
    }
    } catch (error) {
        ServerDetails.RegisterServerError("Confirm Email", error.toString());
        return res.status(500).send( { error: error } )
    }
}

//  Method for Request Password Reset
exports.RequestPasswordReset = async (req, res, next) => {
    try {
    showRequestId()
    var emailUser = req.body.email
    const query = `SELECT * FROM tbl_account;`
    console.log( "Email: " + emailUser)
    const result = await mysql.execute(query)
    if(result.length > 0){
        for(var i = 0 ; i < result.length; i++){
            console.log(result)
            var email = EncryptDep.Decrypt(result[i].email);
            if(email == emailUser ){
            var email_user = email
            var id_user = result[i].id_user
            var idPasswordReset = "pswd"+ makeidForUser(9) + "PalacePetz-" + "sys" + makeidForUser(1) + "tem"+ makeidForUser(3) + "a"+ makeidForUser(2) + "c"+ makeidForUser(3) + "e"+ makeidForUser(1) + "key" + makeidForUser(4) + "-Pala"+ makeidForUser(5) +"cePetz-pswd" + makeidForUser(8) + 'p0'
            const queryUpdate = `UPDATE tbl_account SET verify_id = ? WHERE id_user = ?`
            await mysql.execute(queryUpdate, [idPasswordReset, id_user])
            var resultEmail = Emails.SendPasswordReset(email_user, 'https://palacepetz.azurewebsites.net/' + "novasenha/" + idPasswordReset + "/" + id_user)
            if(resultEmail == "Sent"){
                return res.status(200).send({ message: 'Password reset email sent' })
            }else{
                return res.status(200).send({ message: 'Password reset email sent' })
            }
            }
        }
    }else{
        return res.status(404).send( { message: 'User not registered' } )
    }
    } catch (error) {
        ServerDetails.RegisterServerError("Confirm Email", error);
        return res.status(500).send( { error: error.toString() } )
    }
}

//  Method to change user password
exports.ChangePassword = async (req, res, next) => {
    var verify_id = req.body.verify_id
    var id_user = req.body.id_user
    var newpassword = req.body.newpassword
    var last2 = verify_id.slice(-2);
    if(verify_id.substr(0, 4) === "pswd" || last2 == 'p0') {
        var query = `SELECT verify_id, verify FROM tbl_account WHERE id_user = ?`
        var result = await mysql.execute(query, id_user)
        if(result.length > 0){
            if(result[0].verify_id == verify_id){
                if(result[0].verify == 1){
                    const hash = await bcrypt.hashSync(newpassword, 12);
                    var queryUpdate = `UPDATE tbl_account SET password = ?, verify_id = "Confirmed" WHERE id_user = ?`
                    await mysql.execute(queryUpdate, [ hash, id_user ])
                    return res.status(200).send({ message: 'Password updated' })
                }else
                return res.status(401).send({ message: 'User does not contain verified email' })
            }else
            return res.status(405).send({ message: 'ID does not correspond to a password change' })
        }else
        return res.status(405).send({ message: 'User not registered' })
    }else{
        return res.status(405).send({ message: 'ID does not correspond to a password change' })
    }
}

function showRequestId(){
    requestId++;
    console.log("---------------------\n-- ✅ Request Id: " + requestId + "\n---------------------")
}

function makeidForUser(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * 
    charactersLength)));
    }
    var charset = result.join('');
   var id = charset + Math.floor(Math.random() * 256);
    return id;
}