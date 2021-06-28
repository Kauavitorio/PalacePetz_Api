const mysql = require('../mysql')
const bcrypt = require('bcrypt');
const EncryptDep = require('../controllers/encryption')
const ServerDetails = require('../ServerInfo') 
const BadWords = require('../controllers/badWords')
const CpfValidator = require('../CpfValidator')
const Emails = require('./email')
const IMG_USER = 'https://www.kauavitorio.com/host-itens/Default_Profile_Image_palacepetz.png';

//  Method for login user
exports.Login = async (req, res, next) => {
    try{
        ServerDetails.showRequestId()
        var Userlist = []
        var login_emput = req.body.email
        var password = req.body.password
        var id_user = 0;
        if (validateEmail(login_emput)){
            const resultList = await mysql.execute('SELECT email, id_user FROM tbl_account;')
            if(resultList.length > 0){
                for(var i = 0 ; i < resultList.length; i++){
                    var emailGet = EncryptDep.Decrypt(resultList[i].email);
                    if(emailGet == login_emput){
                        id_user = resultList[i].id_user
                        Userlist.push(id_user)
                    }
                }
                if(Userlist.length > 0){
                    const result = await mysql.execute('SELECT * FROM tbl_account WHERE id_user = ?', id_user)
                    if(result.length > 0){
                        var nm_verify_bad = EncryptDep.Decrypt(result[0].name_user);
                        if(BadWords.VerifyUsername(nm_verify_bad))
                            Block_User(result[0].id_user)
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
                            img_user: EncryptDep.Decrypt(result[0].img_user),
                            status: result[0].status
                        }
                    if(result[0].status == 0)
                        return res.status(410).send({ message: 'This user is disable'});
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
        }else if(CpfValidator.testCPF(login_emput)){
            const resultList = await mysql.execute('SELECT cpf_user, id_user, password FROM tbl_account;')
            if(resultList.length > 0){
                for(var i = 0 ; i < resultList.length; i++){
                    var cpf_userGET = EncryptDep.Decrypt(resultList[i].cpf_user);
                    if(cpf_userGET.trim().replace(/\./g, '').replace('-', '') == login_emput.trim().replace(/\./g, '').replace('-', '')
                    && bcrypt.compareSync(password, resultList[i].password)){
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
                            img_user: EncryptDep.Decrypt(result[0].img_user),
                            status: result[0].status
                        }
                        if(result[0].status == 0)
                            return res.status(410).send({ message: 'This user is disable'});
                    if(verify_id == "Confirmed" || verify == 1)
                        return res.status(200).send(response);
                    else
                        return res.status(405).send( {message: 'Email is not verified !!'} );
                    
                    }else
                        return res.status(401).send({ message: "Password or email invalid" });
                    
                    }
                }else{
                    return res.status(401).send({ message: "Password or email invalid" });
                }
            }else{
                console.log('No email on database')
                return res.status(500).send({ error: "No email on database"})
            }
        }
        else{
            const resultList = await mysql.execute('SELECT username, id_user FROM tbl_account;')
            if(resultList.length > 0){
                for(var i = 0 ; i < resultList.length; i++){
                    var usernameGET = EncryptDep.Decrypt(resultList[i].username);
                    if(usernameGET == login_emput.toLowerCase()){
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
                            img_user: EncryptDep.Decrypt(result[0].img_user),
                            status: result[0].status
                        }
                    if(result[0].status == 0)
                        return res.status(410).send({ message: 'This user is disable'});
                    if(verify_id == "Confirmed" || verify == 1)
                        return res.status(200).send(response);
                    else
                        return res.status(405).send( {message: 'Email is not verified !!'} );
                    
                    }else
                        return res.status(401).send({ message: "Password or email invalid" });
                    
                    }
                }else{
                    return res.status(401).send({ message: "Password or email invalid" });
                }
            }else{
                console.log('No email on database')
                return res.status(500).send({ error: "No email on database"})
            }
        }
        
    }catch (error){
        ServerDetails.RegisterServerError("Login User", error.toString());
        return res.status(500).send({ error: error.toString()})
    }
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

//  Method for register new user
exports.RegisterUsers = async (req, res, next) => {
    try {
        ServerDetails.showRequestId()
        if(BadWords.VerifyUsername(req.body.name_user)){
            return res.status(406).send({ error: "Username not allowed"})
        }else{
            var Emailcollection = [];
            var Cpfcollection = [];
            const resultList = await mysql.execute('SELECT email FROM tbl_account;')
            if(resultList.length > 0){
                for(var i = 0 ; i < resultList.length; i++){
                var email = EncryptDep.Decrypt(resultList[i].email);
                var cpf = EncryptDep.Decrypt(resultList[i].cpf_user);
                if(email == req.body.email )
                    Emailcollection.push(i)

                if(cpf == req.body.cpf_user )
                    Cpfcollection.push(i)

                }
            if(Emailcollection.length > 0)
                return res.status(409).send({ message: 'User already registered' })
            else if(Cpfcollection.length > 0)
                return res.status(412).send({ message: 'Cpf already registered' })
            else{
                var idVerifyEMail = Generate_verify_id_for_user(2) + "-Pala"+ Generate_verify_id_for_user(1) +"cePetz-" + "a" + Generate_verify_id_for_user(1) + "l"+ Generate_verify_id_for_user(3) + "a"+ Generate_verify_id_for_user(1) + "c"+ Generate_verify_id_for_user(1) + "e"+ Generate_verify_id_for_user(1) + Generate_verify_id_for_user(9) + "-Pala"+ Generate_verify_id_for_user(1) +"cePetz-" + Generate_verify_id_for_user(2)
                const hash = await bcrypt.hashSync(req.body.password, 12);
                var cpf_userBase = req.body.cpf_user
                var nm_userBase = req.body.name_user
                var username = nm_userBase.replace(' ', '').toLowerCase() + cpf_userBase.split(".")[0] + cpf_userBase.split(".")[1];
                query = 'INSERT INTO tbl_account (name_user, username, email, cpf_user, password, img_user, verify_id, status) VALUES (?,?,?,?,?,?,?,?)';
                var results = await mysql.execute(query, [ EncryptDep.Encrypto(req.body.name_user), EncryptDep.Encrypto(username), EncryptDep.Encrypto(req.body.email),
                    EncryptDep.Encrypto(req.body.cpf_user), hash, EncryptDep.Encrypto(IMG_USER), idVerifyEMail, 1])

                this.UpdateUserNameIntern(results.insertId, nm_userBase.replace(' ', '').toLowerCase())

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
                var idVerifyEMail = Generate_verify_id_for_user(2) + "-Pala"+ Generate_verify_id_for_user(1) +"cePetz-" + "a" + Generate_verify_id_for_user(1) + "l"+ Generate_verify_id_for_user(3) + "a"+ Generate_verify_id_for_user(1) + "c"+ Generate_verify_id_for_user(1) + "e"+ Generate_verify_id_for_user(1) + Generate_verify_id_for_user(9) + "-Pala"+ Generate_verify_id_for_user(1) +"cePetz-" + Generate_verify_id_for_user(2)
                const hash = await bcrypt.hashSync(req.body.password, 12);
                var cpf_userBase = req.body.cpf_user
                var nm_userBase = req.body.name_user
                var username = nm_userBase.replace(' ', '').toLowerCase() + cpf_userBase.split(".")[0] + cpf_userBase.split(".")[1];
                query = 'INSERT INTO tbl_account (name_user, username, email, cpf_user, password, img_user, verify_id, status) VALUES (?,?,?,?,?,?,?,?)';
                var results = await mysql.execute(query, [ EncryptDep.Encrypto(req.body.name_user), EncryptDep.Encrypto(username), EncryptDep.Encrypto(req.body.email),
                    EncryptDep.Encrypto(req.body.cpf_user), hash, EncryptDep.Encrypto(IMG_USER), idVerifyEMail, 1])

                this.UpdateUserNameIntern(results.insertId, nm_userBase.replace(' ', '').toLowerCase())

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
        ServerDetails.showRequestId()
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
        ServerDetails.showRequestId()
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
        ServerDetails.showRequestId()
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

exports.ConfirmEmail = async (req, res, next) => {
    try {
        
        ServerDetails.showRequestId()
        var verify_id = req.params.verify_id
        var id_user = req.params.id_user
        if(verify_id == null || verify_id == " " || verify_id == "" || id_user == null || id_user == " " || id_user == ""){
            res.status(500).send({ message: 'Erro ao receber suas informações, tente novamente mais tarde.' })
        }else{
            const resultList = await mysql.execute('SELECT verify_id FROM tbl_account WHERE id_user = ?;', id_user)
            if(resultList.length > 0){
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
        ServerDetails.showRequestId()
    var emailUser = req.body.email
    var UserValiList = []
    var email_user;
    var id_user;
    const query = `SELECT * FROM tbl_account;`
    const result = await mysql.execute(query)
    if(result.length > 0){
        for(var i = 0 ; i < result.length; i++){
            var email = EncryptDep.Decrypt(result[i].email);
            if(email == emailUser ){
                email_user = email
                id_user = result[i].id_user
                UserValiList.push(email)
            }
        }
        if(UserValiList.length > 0){
            var idPasswordReset = "pswd"+ Generate_verify_id_for_user(9) + "PalacePetz-" + "sys" + Generate_verify_id_for_user(1) + "tem"+ Generate_verify_id_for_user(3) + "a"+ Generate_verify_id_for_user(2) + "c"+ Generate_verify_id_for_user(3) + "e"+ Generate_verify_id_for_user(1) + "key" + Generate_verify_id_for_user(4) + "-Pala"+ Generate_verify_id_for_user(5) +"cePetz-pswd" + Generate_verify_id_for_user(8) + 'p0'
            const queryUpdate = `UPDATE tbl_account SET verify_id = ? WHERE id_user = ?`
            await mysql.execute(queryUpdate, [idPasswordReset, id_user])
            var resultEmail = Emails.SendPasswordReset(email_user, 'https://palacepetz.azurewebsites.net/' + "novasenha/" + idPasswordReset + "/" + id_user)
            if(resultEmail == "Sent"){
                return res.status(200).send({ message: 'Password reset email sent' })
            }else{
                return res.status(200).send({ message: 'Password reset email sent' })
            }
        }else
            return res.status(404).send( { message: 'User not registered' } )
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
    try {
        ServerDetails.showRequestId()
        var verify_id = req.body.verify_id
        var id_user = req.body.id_user
        var newpassword = req.body.newpassword
        var email_user;
        var nm_user;
        var last2 = verify_id.slice(-2);
        if(verify_id.substr(0, 4) === "pswd" || last2 == 'p0') {
            var query = `SELECT * FROM tbl_account WHERE id_user = ?`
            var result = await mysql.execute(query, id_user)
            if(result.length > 0){
                email_user = EncryptDep.Decrypt(result[0].email);
                nm_user = EncryptDep.Decrypt(result[0].name_user);
                if(result[0].verify_id == verify_id){
                    if(result[0].verify == 1){
                        const hash = await bcrypt.hashSync(newpassword, 12);
                        var queryUpdate = `UPDATE tbl_account SET password = ?, verify_id = "Confirmed" WHERE id_user = ?`
                        await mysql.execute(queryUpdate, [ hash, id_user ])
                        Emails.SendPasswordHasChange(email_user, nm_user, id_user)
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
    } catch (error) {
        ServerDetails.RegisterServerError("Change Password", error);
        return res.status(500).send( { error: error } )
    }
}

//  Method to Register Products on User Historic
exports.Register_Product_On_User_Historic = async (req, res, next) => {
    try {
        var id_user = req.params.id_user
        var cd_prod = req.params.cd_prod
        var datetime = ServerDetails.GetDate() + " " + ServerDetails.GetTime()

        var resultSearch = await mysql.execute('SELECT * FROM tbl_product_historic where id_user = ? and cd_prod = ?', [ id_user, cd_prod ])
        if(resultSearch.length > 0){
            await mysql.execute('UPDATE tbl_product_historic SET datetime = ? WHERE cd_prod = ? and id_user = ?;',
            [datetime, cd_prod, id_user])
            return res.status(409).send({message: `Product is registred.`})
        }
        else{
            var resultInsert = await mysql.execute('INSERT INTO tbl_product_historic (id_user, cd_prod, datetime) VALUES (?, ?, ?)', [id_user, cd_prod, datetime])
            const response = {
                message: 'Successfully inserted',
                cd_historic: resultInsert.insertId
            }
            res.status(201).send(response)
        }

    } catch (error) {
        ServerDetails.RegisterServerError("Register Product Historic", error.toString());
        return res.status(500).send( { error: error } )
    }
}

//  Method to get User Historic
exports.GetUserHistoric = async (req, res, next) => {
    try {
        var id_user = req.params.id_user
        var result_USER = await mysql.execute('SELECT * FROM tbl_account WHERE id_user = ?', id_user)
        if(result_USER.length > 0){
            var results = await mysql.execute(`select 
            hist.cd_historic,
            hist.id_user,
            hist.cd_prod,
            hist.datetime,
            prod.cd_prod,
            prod.image_prod,
            prod.nm_product,
            prod.product_price
            from tbl_product_historic as hist inner join tbl_products as prod
            on hist.cd_prod = prod.cd_prod where hist.id_user = ?;`, id_user)
            if(results.length > 0){
                const response = {
                    Search: results.map(hist => {
                        return {
                            cd_historic: parseInt(hist.cd_historic),
                            id_user: parseInt(hist.id_user),
                            datetime: hist.datetime,
                            cd_prod: parseInt(hist.cd_prod),
                            image_prod: hist.image_prod,
                            nm_product: hist.nm_product,
                            product_price: hist.product_price
                        }
                    })
                    }
                return res.status(200).send(response)
            }else{
                const response = {
                    Search: results.map(cart => {
                        return {
                            cd_cart: 0,
                            cd_prod: 0,
                            nm_product: "Nenhum Produto em sue carrinho",
                            image_prod: "https://media.discordapp.net/attachments/707671310104526863/846488817367384144/unnamed-removebg-preview.png?width=467&height=467",
                            amount: 0,
                            id_user: 0,
                            product_price: 0,
                            totalPrice: 0,
                            product_amount: 0,
                            sub_total: 0
                        }
                    })
                    }
                return res.status(206).send(response)
            }
        }else
            return res.status(404).send( { message: 'User not registered' } )
    } catch (error) {
        ServerDetails.RegisterServerError("Get Product Historic", error.toString());
        return res.status(500).send( { error: error } )
    }
}

//  Method to clear User Hostoric
exports.ClearHistoric = async (req, res, next) => {
    try {
        var id_user = req.params.id_user
        var result_USER = await mysql.execute('SELECT * FROM tbl_account WHERE id_user = ?', id_user)
        if(result_USER.length > 0){
            /* Clear Table Historic */
            await mysql.execute(`DELETE FROM tbl_product_historic WHERE id_user = ?`, id_user) 
            res.status(200).send({message: 'Historic sucessfully clear'})
        }else
            return res.status(404).send( { message: 'User not registered' } )
    } catch (error) {
        ServerDetails.RegisterServerError("Clear Product Historic", error.toString());
        return res.status(500).send( { error: error } )
    }
}

//  Method for Update UserName
exports.UpdateUserName = async (req, res, next) => {
    try{
        ServerDetails.showRequestId()
        var queryUser = `SELECT * FROM tbl_account WHERE id_user = ?;`
        var result = await mysql.execute(queryUser, req.body.id_user)
        if(result.length > 0){
            if(BadWords.VerifyUsername(req.body.username)){
                return res.status(406).send({ error: "Username not allowed"})                
            }else{
                var query = `UPDATE tbl_account SET 
                username = ?
                    WHERE id_user = ?;`
                await mysql.execute(query, [EncryptDep.Encrypto(req.body.username), req.body.id_user])
                return res.status(200).send( { message: 'Username successfully update'} )
            }
        }else{
            return res.status(404).send( { message: 'User not registered' } )
        }
    }catch(error){
        ServerDetails.RegisterServerError("Update Profile", error.toString());
        return res.status(500).send( { error: error } )
    }
}

//  Method for Update UserName
exports.UpdateUserNameIntern = async (id_user, username) => {
    try{
        var newUserName = username + id_user;
        var query = `UPDATE tbl_account SET 
            username = ?
                WHERE id_user = ?;`
            await mysql.execute(query, [EncryptDep.Encrypto(newUserName), id_user])
    }catch(error){
        ServerDetails.RegisterServerError("Update Profile", error.toString());
    }
}

function Generate_verify_id_for_user(length) {
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

async function Block_User(id_user){
    await mysql.execute('UPDATE tbl_account SET status = 0 WHERE id_user = ?;', id_user)
}